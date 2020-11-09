#!/usr/bin/env Rscript
args <- commandArgs(trailingOnly=TRUE)
linkid <- args[1]
myPath <- args[2]

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
load(paste0(myPath, "/infoDT.Rdata"))

#----------------------- Now is time to start the subsetting -------------------------------------------------------------------
# Here I (Arezoo) have not changes the infromation from the script Aubrey had, eventhough we do not need buffer anymore, 
# I kept it to be similar to what Aubrey had 

#if (!is.null(gageIds)) {
#  folderName <- routlinkInfoSub[link == linkid]$site_no
#} else {
#  folderName <- linkid
#}

folderName <- infoDT[link == linkid, ]$dirname
gageid <- infoDT[link == linkid, ]$site_no
  
system(paste0("mkdir -p ", folderName))
system(paste0("mkdir -p ", folderName, "/FORCING/"))

message(paste0("Link=", linkid, " Gage=", gageid))

# =====================================================================
# Specify the NEW (subset extent) domain files:

# Routing domain file
subHydFile <- paste0(folderName, "/Fulldom.nc")

# Geogrid domain file
subGeoFile <- paste0(folderName, "/geo_em.nc")

# Wrfinput domain file
subWrfFile <- paste0(folderName, "/wrfinput.nc")

# Route link file
subRtlinkFile <- paste0(folderName, "/RouteLink.nc")

# Spatial weights file
subSpwtFile <- paste0(folderName, "/spatialweights.nc")
  
# GW bucket parameter file
subGwbuckFile <- paste0(folderName, "/GWBUCKPARM.nc")
  
# Soil parameter file
subSoilparmFile <- paste0(folderName, "/soil_properties.nc")
  
# Lake parameter file
subLakeparmFile <- paste0(folderName,  "/LAKEPARM.nc")
  
# Coordinate parameter text file
subCoordParamFile <- paste0(folderName, "/params.txt")
  
# Forcing clip script file
subScriptFile <- paste0(folderName, "/script_forcing_subset.txt")
  
#=================================================================================
  
# Get subsetting dimensions
geo_w <- infoDT[link == linkid]$geo_w
geo_e <- infoDT[link == linkid]$geo_e
geo_s <- infoDT[link == linkid]$geo_s
geo_n <- infoDT[link == linkid]$geo_n
hyd_w <- infoDT[link == linkid]$hyd_w
hyd_e <- infoDT[link == linkid]$hyd_e
hyd_s <- infoDT[link == linkid]$hyd_s
hyd_n <- infoDT[link == linkid]$hyd_n
hyd_min <- infoDT[link == linkid]$hyd_min
hyd_max <- infoDT[link == linkid]$hyd_max
geo_min <- infoDT[link == linkid]$geo_min
geo_max <- infoDT[link == linkid]$geo_max

# Get relevant real coords for new bounds
geo_min_col <- infoDT[link == linkid]$geo_w
geo_max_col <- infoDT[link == linkid]$geo_e
geo_min_row <- infoDT[link == linkid]$geo_min
geo_max_row <- infoDT[link == linkid]$geo_max
  
rowcol_new <- data.frame(id=c(1,2,3,4), row=c(geo_max_row, geo_min_row, geo_min_row, geo_max_row),
                           col=c(geo_min_col, geo_min_col, geo_max_col, geo_max_col))
sp_new_proj <- xyFromCell(geohgt, raster::cellFromRowCol(geohgt, rowcol_new$row, rowcol_new$col), spatial=TRUE)
sp_new_wrf <- sp::coordinates(sp::spTransform(sp_new_proj, "+proj=longlat +a=6370000 +b=6370000 +no_defs"))
  
#---------------------------- SUBSET DOMAINS  

# NCO starts with 0 index for dimensions, so we have to subtract 1

# ROUTING GRID

cmd <- paste0("ncks -O -d x,", hyd_w-1, ",", hyd_e-1, " -d y,", hyd_min-1, ",", hyd_max-1, " ", fullHydFile, " ", subHydFile)
print(cmd)
system(cmd)

# GEO GRID

# Dimension subsetting
cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullGeoFile, " ", subGeoFile)
print(cmd)
system(cmd)
# Remove stagger dimensions since not used
cmd <- paste0("ncwa -O -a west_east_stag ", subGeoFile, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncwa -O -a south_north_stag ", subGeoFile, " ", subGeoFile)
system(cmd)
# Attribute updates
cmd <- paste0("ncatted -h -a WEST-EAST_GRID_DIMENSION,global,o,l,", geo_e-geo_w+2, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a SOUTH-NORTH_GRID_DIMENSION,global,o,l,", geo_n-geo_s+2, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_UNSTAG,global,o,l,", geo_e-geo_w+1, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_UNSTAG,global,o,l,", geo_n-geo_s+1, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_START_STAG,global,d,,, ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_START_STAG,global,d,,, ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_STAG,global,d,,, ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_STAG,global,d,,, ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a i_parent_end,global,o,l,", geo_e-geo_w+2, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a j_parent_end,global,o,l,", geo_n-geo_s+2, " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a corner_lons,global,o,f,", sp_new_wrf[1,1], " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -h -a corner_lats,global,o,f,", sp_new_wrf[1,2], " ", subGeoFile)
system(cmd)

# WRFINPUT GRID

cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullWrfFile, " ", subWrfFile)
print(cmd)
system(cmd)
# Attribute updates
cmd <- paste0("ncatted -h -a WEST-EAST_GRID_DIMENSION,global,o,l,", geo_e-geo_w+2, " ", subWrfFile)
system(cmd)
cmd <- paste0("ncatted -h -a SOUTH-NORTH_GRID_DIMENSION,global,o,l,", geo_n-geo_s+2, " ", subWrfFile)
system(cmd)

#---------------------------- SUBSET PARAMS -----------------------------------

# Identify catchments to keep

fullWts <- ReadWtFile(fullSpwtFile)
keepIdsPoly <- subset(fullWts[[1]], fullWts[[1]]$i_index >= hyd_w & fullWts[[1]]$i_index <= hyd_e &
                        fullWts[[1]]$j_index >= hyd_s & fullWts[[1]]$j_index <= hyd_n)
keepIdsPoly <- unique(keepIdsPoly$IDmask)

fullRtlink <- ReadLinkFile(fullRtlinkFile)
keepIdsLink <- upComIdsAll[[as.character(linkid)]]
keepIds <- unique(c(keepIdsPoly, keepIdsLink))

# SPATIAL WEIGHT

subWts <- SubsetWts(fullWts, keepIdsPoly, hyd_w, hyd_e, hyd_s, hyd_n)
file.copy(fullSpwtFile, subSpwtFile, overwrite=TRUE)
UpdateWtFile(subSpwtFile, subWts[[1]], subWts[[2]], subDim=TRUE)

# GWBUCK PARAMETER

fullGwbuck <- GetNcdfFile(fullGwbuckFile, quiet=TRUE)
subGwbuck <- subset(fullGwbuck, fullGwbuck$ComID %in% keepIdsPoly)
subGwbuck$Basin <- seq(1, nrow(subGwbuck), 1)
file.copy(fullGwbuckFile, subGwbuckFile, overwrite=TRUE)
UpdateGwbuckFile(subGwbuckFile, subGwbuck, subDim=TRUE)

# ROUTE LINK

subRtlink <- subset(fullRtlink, fullRtlink$link %in% keepIds)
subRtlink$to <- ifelse(subRtlink$to %in% unique(subRtlink$link), subRtlink$to, 0)
file.copy(fullRtlinkFile, subRtlinkFile, overwrite=TRUE)
UpdateLinkFile(subRtlinkFile, subRtlink, subDim=TRUE)

# SOIL PARAMETER

cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullSoilparmFile, " ", subSoilparmFile)
system(cmd)

# LAKE PARAMETER

# nothing for now...
file.copy(fullLakeparmFile, subLakeparmFile, overwrite=TRUE)

# OBS
load(obsFile)
obsStrData <- obsStrData[site_no==gageid,]
names(obsStrData)[which(names(obsStrData)=="q_cms")] <- "obs"
obsStrMeta <- subset(obsStrMeta, obsStrMeta$site_no==gageid)
save(obsStrData, obsStrMeta, file=paste0(folderName, "/obsDT.Rdata"))


#--------------------------------- CREATE SCRIPT FILES 

# Save the coordinate parameter file
coordsExport <- data.frame(grid=c("hyd_sn", "hyd_ns", "geo_sn", "geo_ns"),
                           imin=c(hyd_w, hyd_w, geo_w, geo_w),
                           imax=c(hyd_e, hyd_e, geo_e, geo_e),
                           jmin=c(hyd_s, hyd_min, geo_s, geo_min),
                           jmax=c(hyd_n, hyd_max, geo_n, geo_max),
                           index_start=c(1,1,1,1))
write.table(coordsExport, file=subCoordParamFile, row.names=FALSE, sep="\t")

# Save the forcing subset script file
oldForcPath <- fullForcDir
newForcPath <- paste0(folderName, "/FORCING/")

#ncksCmd <- paste0("ncks -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ${OLDFORCPATH}/${i} ${NEWFORCPATH}/${i}")
ncksCmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ${OLDFORCPATH}/${i##*/} ${NEWFORCPATH}/${i##*/}")
fileConn <- file(subScriptFile)
writeLines(c("#!/bin/bash",
             "OLDFORCPATH=$1",
             "NEWFORCPATH=$2",
             "for i in `ls $OLDFORCPATH`; do",
             "echo ${i##*/}",
             ncksCmd,
             "done"),
           fileConn)
close(fileConn)


ncksCmd <- paste0("ncks -O -d ncl0,", geo_s-1, ",", geo_n-1, " -d ncl1,", geo_w-1, ",", geo_e-1, " -d ncl2,", geo_s-1, ",", geo_n-1, " -d ncl3,", geo_w-1, ",", geo_e-1, " -d ncl4,", geo_s-1, ",", geo_n-1, " -d ncl5,", geo_w-1, ",", geo_e-1, " -d ncl6,", geo_s-1, ",", geo_n-1, " -d ncl7,", geo_w-1, ",", geo_e-1, " -d ncl8,", geo_s-1, ",", geo_n-1, " -d ncl9,", geo_w-1, ",", geo_e-1, " -d ncl10,", geo_s-1, ",", geo_n-1, " -d ncl11,", geo_w-1, ",", geo_e-1, " -d ncl12,", geo_s-1, ",", geo_n-1, " -d ncl13,", geo_w-1, ",", geo_e-1, " -d ncl14,", geo_s-1, ",", geo_n-1, " -d ncl15,", geo_w-1, ",", geo_e-1, " ${OLDFORCPATH}/${i##*/} ${NEWFORCPATH}/${i##*/}")
fileConn <- file(paste0(subScriptFile, "_NWM_REALTIME"))
writeLines(c("#!/bin/bash",
             "OLDFORCPATH=$1",
             "NEWFORCPATH=$2",
             "for i in `ls $OLDFORCPATH`; do",
             "echo ${i##*/}",
             ncksCmd,
             "done"),
           fileConn)
close(fileConn)

# Change permissions
cmd <- paste0("chmod u+x ", subScriptFile)
system(cmd)
cmd <- paste0("chmod u+x ", subScriptFile, "_NWM_REALTIME")
system(cmd)

#-----------------------------------------------------------------------------

#oldForcPath <- fullForcDir
#newForcPath <- paste0(myPath, "/", folderName, "/FORCING/")
#system(paste0("mkdir -p ", newForcPath))
#cmd <- paste0("nohup ", subScriptFile, " ", oldForcPath, " ", newForcPath, " > nohup_", gage, ".out 2>&1&")
#print(cmd)
#system(cmd)

quit("no")

