# This is the script that gets the 


#!/usr/bin/env Rscript
args <- commandArgs(trailingOnly=TRUE)
myPath <- args[1]

#.libPaths(c("/glade/u/home/adugger/system/R/Libraries/R3.2.2",
#            "/glade/p/work/jamesmcc/R/Libraries/R3.2.2.OPERATIONAL",
#            "/glade/u/home/adugger/system/R/Libraries/R3.1.0",
#            "/glade/u/apps/opt/r/3.2.2/intel/16.0.0/lib64/R/library"))
.libPaths(c('/glade/p/work/jamesmcc/R/Libraries/R3.2.2.devCompile.SHARED',.libPaths()))  ### we need this version of rwrfhydro which has latest version of the James work on tracing
library(data.table)
library(ncdf4)
library(raster)
library(rgdal)
library(rwrfhydro)

source("Utils_ReachFiles.R")

source("namelist_SubsetDomainReachRt.R")

load(downstreamReExpFile)
load(upstreamReExpFile)
load(reIndFile)

system(paste0("mkdir -p ", myPath))


# **** perform some checks on the matching length of gageMeta and comIds/gages in case gageMeta is not NULL

if (!is.null(gageIds) & !is.null(comIds)) print("Only one of the two variables (gauges and comIds) is required. The gages would be ignored")

#------------------------------ Extract those ComIds and relvalnt information form the Routlink file to perform the subsetting for them ------------------------------

#routlinkInfo <- as.data.table(GetNcdfFile(fullRtlinkFile,c('gages','link','order', 'index'), q=TRUE))
#routlinkInfo$ind <- 1:nrow(routlinkInfo)
routlinkInfo <- data.table(ReadRouteLink(fullRtlinkFile))
routlinkInfo <- routlinkInfo[, c("gages", "link", "order", "index", "site_no"), with=FALSE]
setnames(routlinkInfo, "index", "ind")
#routlinkInfo[, site_no := trimws(gages)]

if (!is.null(comIds)) {
  routlinkInfoSub <- routlinkInfo[link %in% comIds]
  if (length(setdiff(comIds, routlinkInfoSub$link)) > 0 ) {
    print("Warning : The following ComIds are not in the Routlink, therefore no subsetting will be performed for them : ")
    print(setdiff(comIds, routlinkInfo$link))
  }
} else if (!is.null(gageIds)) {
  routlinkInfoSub <- routlinkInfo[site_no %in% gageIds]
  if (length(setdiff(gageIds, routlinkInfoSub$site_no)) > 0 ) {
    print("Warning : The following gages are not in the Routlink, therefore no subsetting will be performed for them : ")
    print(setdiff(gageIds, routlinkInfoSub$site_no))
  }
}

#------------------------------ Find all the COMIDs above the specified comIds ---------------------------------------
gageInds <- routlinkInfoSub$ind
names(gageInds) <- routlinkInfoSub$link

## make this a list of pairs: gageId, gageInd
dumList <- 1:length(gageInds)
names(dumList) <- trimws(names(gageInds))

gageIndsList <- plyr::llply(dumList, function(ii) list(gageId=names(gageInds)[ii],
                                                       gageInd=gageInds[[ii]]))

gather <- function(gageIdInd) {
  upBranches <- rwrfhydro:::GatherStreamInds(from, start = gageIdInd$gageInd, linkLength=reInd$length)
  indsAll <- c(upBranches$ind, upBranches$startInd)
  upComIds <- routlinkInfo[ind %in% indsAll, link]
}

upComIdsAll <- plyr::llply(gageIndsList, gather, .parallel = FALSE)

#------------------  To find the min, max i and j values from the spatial weight files -------------------------------------------------------------- 

# build a datatable using the spatial weight file created by Kevin for NHDPlus
IDmask <- ncdump(fullSpwtFile, "IDmask", quiet = TRUE) # ID mask is the name of the polygon which is the same as the link in Routlink file
i_index  <- ncdump(fullSpwtFile, "i_index", quiet = TRUE) # index in the x dimension of the raster grid (starting from 1,1 in the LL corner)
j_index <- ncdump(fullSpwtFile, "j_index", quiet = TRUE) # index in the y dimension of the raster grid (starting from 1,1 in the LL corner)

swDT <- data.table(i_index = i_index, j_index = j_index, IDmask = IDmask)

infoDT <- as.data.table(plyr::ldply(upComIdsAll, function(x) {
  # print(x)
  sub <- swDT[IDmask %in% x]
  data.frame(hyd_w = min(sub$i_index), hyd_e = max(sub$i_index), hyd_s = min(sub$j_index), hyd_n = max(sub$j_index))
}))

# This part was added  after we saw some water balance issue with the subsetting domain, in short the hydro Domain the old verison
# was creating a smaller Fuldom domain compared to geoDomain

infoDT$hyd_w <- floor((infoDT$hyd_w - 0.00001*dxy)/dxy)*dxy + 1
infoDT$hyd_s <- floor((infoDT$hyd_s - 0.00001*dxy)/dxy)*dxy + 1

infoDT$hyd_e <- ceiling((infoDT$hyd_e)/dxy)*dxy
infoDT$hyd_n <- ceiling((infoDT$hyd_n)/dxy)*dxy

#******** Then we need to add the geo_min, geo_max (the min and max row number when the 1,1 is upperRight corner) and the hydro information
# grab the geo_domain information from hydro boundaries

infoDT[, `:=` (geo_w = floor((hyd_w-0.00001*dxy)/dxy) + 1 ,
               geo_e = floor((hyd_e-0.00001*dxy)/dxy) + 1,
               geo_s = floor((hyd_s-0.00001*dxy)/dxy) + 1,
               geo_n = floor((hyd_n-0.00001*dxy)/dxy) + 1)]


# Create temp geogrid tif
tmpfile <- tempfile(fileext=".tif")
ExportGeogrid(fullGeoFile, "HGT_M", tmpfile)
geohgt <- raster::raster(tmpfile)
file.remove(tmpfile)

infoDT[, `:=` (geo_min = dim(geohgt)[1] - geo_n + 1,
               geo_max = dim(geohgt)[1] - geo_s + 1 )]


infoDT[, `:=` (hyd_min = (geo_min-1)*dxy+1,
               hyd_max = geo_max*dxy)]

setnames(infoDT, ".id", "link")
infoDT[, link := as.integer(link)]
infoDT <- merge(infoDT, routlinkInfo[, c("link", "site_no"), with=FALSE], by="link")

if (!is.null(gageIds)) {
  infoDT[, dirname :=  paste0(myPath, "/", site_no)]
} else {
  infoDT[, dirname :=  paste0(myPath, "/", link)]
}

# Add metadata
load(obsFile)
obsStrMeta <- obsStrMeta[,c("agency_cd", "site_no", "site_name", "lat", "lon",
                            "area_sqmi", "area_sqkm",
                            "county_cd", "state", "HUC2", "HUC4", "HUC6", "HUC8",
                            "ecol3", "ecol4")]
infoDT <- merge(infoDT, obsStrMeta, by="site_no")

# Save R data
#save(infoDT , file = paste0(myPath, "/infoDT.Rdata"))
rm(swDT,IDmask,i_index,j_index,routlinkInfo,reInd,from,to)
save.image(paste0(myPath, "/infoDT.Rdata"))

# Export text metadata file
write.table(infoDT, file=paste0(myPath, "/infoDT.csv"), row.names=FALSE, sep=",")
#write.table(fullForcDir, file=paste0(myPath, "/forcpath.txt"), row.names=FALSE)
fileConn<-file(paste0(myPath, "/forcpath.txt"))
writeLines(fullForcDir, fileConn)
close(fileConn)


quit("no")


