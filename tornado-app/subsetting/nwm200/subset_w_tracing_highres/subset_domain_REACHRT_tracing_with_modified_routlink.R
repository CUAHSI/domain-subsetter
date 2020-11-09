#******************************************  Script description  ****************************************************************************
#
# This script is being modified to minimize the manual work required for the massive subsetting (for the second round of calibration)
# The only input required is either the list of comIDs, or the list of gagesID, 
# If the gage does not exists in the Routlink file, it just throws a warning and continue with the subsetting the gauges which exists in the Routlink file
#
#*********************************************************************************************************************************************
library(data.table)

.libPaths(c('/glade/p/work/jamesmcc/R/Libraries/R3.2.2.devCompile.SHARED'))  ### we need this version of rwrfhydro which has latest version of the James work on tracing
library(rwrfhydro)
library(ncdf4)
source("Utils_ReachFiles.R")
library(raster)
library(foreach)
#------------------------------------------ INPUTS : Please change the following parts as instructed ------------------------------------------

# Specify your new domain file directory, all the subsetted domains will be places here
myPath <- "/glade/scratch/arezoo/"

# A charcter vector : list of the comIDs to be used for subsetting, 
# if gages is defined comIds should be NULL
# They should exists in the Routlink otherwise gives you a warning and proceed to the next one
comIds <- NULL
#comIds <- c("7086109", "7040481", "7053819", "14299781", "14251875")

# A character vector : list of the gauges to be used for subsetting, 
# if comIds is specified, gages should be NULL
# if specified then should exists on the Routlink, otherwise only gives you a warning and proceed to the next one
gageIds <- NULL
gageIds <- "04282500"

#=============================================== No need to modify anything from here ==============================================================================

#******  Specify the ORIGINAL (full extent) domain files: *****************

# Routing domain file
#fullHydFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/Fulldom_hires_netcdf_file_250m_CALIB3_lksatfac.nc"
fullHydFile <- "/glade/u/home/adugger/P_NWMV12/CONUS_CALIB/DOMAIN/Fulldom_hires_netcdf_file_250m_NWMv1.2_harmdem_DEFPARAMS.nc"

# Geogrid domain file
#fullGeoFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/geo_em.d01.nc.conus_1km_nlcd11_glacfix"
fullGeoFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/geo_em.d01.nc.conus_1km_nlcd11_glacfix"

# Wrfinput domain file
#fullWrfFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/wrfinput_d01_1km_nlcd11_glacfix_soilwatfix"
fullWrfFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/wrfinput_d01_1km_nlcd11_glacfix_soilwatfix"

# Route link file
#fullRtlinkFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/RouteLink_2016_04_07.nudgingOperational2016-04-08_chanparm3_mann_BtmWdth_XYCOORD.nc"
# I needed to include the index to the Routlink file, the index has been used by James for the tracing, so if one wants to use the tracing for another subsetting 
# from the subsetted domain then, this the index is required. 

#fullRtlinkFile <- "/glade/scratch/arezoo/STEP_cutout/subset_scripts/RouteLink_2016_04_07.nudgingOperational2016-04-08_chanparm3_mann_BtmWdth_XYCOORD.nc"
fullRtlinkFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS_INDEXED.nc"

# Spatial weights file
#fullSpwtFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/spatialweights_IOC_all_basins_250m_2015_12_30.nc"
fullSpwtFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/spatialweights_250m_v1_1_all_basins_20161104_.nc"

# GW bucket parameter file
#fullGwbuckFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/GWBUCKPARM_OCONUS_2016_01_03_CALIB3.nc"
fullGwbuckFile <- "/glade/u/home/adugger/P_NWMV12/CONUS_CALIB/DOMAIN/GWBUCKPARM_NWM_v1_1_20161104_sorted_NEWPARAMS_DEFPARAMS.nc"

# Soil parameter file
#fullSoilparmFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/soil_properties_CONUS_v4_ter_rtg_CALIB3_nlcd11_AllMBSoilParamFix.nc"
fullSoilparmFile <- "/glade/u/home/adugger/P_NWMV12/CONUS_CALIB/DOMAIN/soil_properties_DEFPARAMS.nc"

# Lake parameter file
#fullLakeparmFile <- "/glade/p/ral/RHAP/adugger/WH_REPO/DOMAINS/CONUS_IOC/LAKEPARM_ks_scaled_max_el_Feb_12_2016_1d_WeirC_OrificeC_min_alt_1.0_WeirL_35.0_RELABEL_goodlakes1260.nc"
fullLakeparmFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/LAKEPARM_ks_scaled_max_el_Feb_12_2016_1d_WeirC_OrificeC_min_alt_1.0_WeirL_35.0_RELABEL_goodlakes1260.nc"

# hydro2D file , set this to NULL if you do not have a hydro 2D file
fullHydro2dFile <- "/glade/p/nwc/adugger/NWM_V12/NWMV12_FINALS/DOMAIN/HYDRO_TBL_2D_NWMv1.2_calib2.nc"

# **** firs we need to load the rexpression files created by James McCreight for the US IOC domian ******

#downstreamReExpFile <- "~jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1/DOMAIN/RouteLink_2016_02_19_no_HI_PR_goodlakes1266.reExpTo.Rdb"
#upstreamReExpFile   <- "~jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1/DOMAIN/RouteLink_2016_02_19_no_HI_PR_goodlakes1266.reExpFrom.Rdb"
#reIndFile       <- "~jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1/DOMAIN/RouteLink_2016_02_19_no_HI_PR_goodlakes1266.reInd.Rdb"

downstreamReExpFile <- "/glade/u/home/jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1.1/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS.reExpTo.Rdb"
upstreamReExpFile   <- "/glade/u/home/jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1.1/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS.reExpFrom.Rdb"
reIndFile       <- "/glade/u/home/jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1.1/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS.reInd.Rdb"

print(load(downstreamReExpFile))
print(load(upstreamReExpFile))
print(load(reIndFile))

# Projection for boundaing coordinates. This needs to be a PROJ4 string
# (e.g., "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs").
coordProj <- "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs"

# Multiplier between routing grid and LSM grid
# (e.g., 1-km LSM and 250-m routing means a value of 4)
dxy <- 4
dxyDest <- 30 # give it in meters

# **** perform some checks on the matching length of gageMeta and comIds/gages in case gageMeta is not NULL

if (!is.null(gageIds) & !is.null(comIds)) print("Only one of the two variables (gauges and comIds) is required. The gages would be ignored")

#------------------------------ Extract those ComIds and relvalnt information form the Routlink file to perform the subsetting for them ------------------------------

routlinkInfo <- as.data.table(GetNcdfFile(fullRtlinkFile,c('gages','link','order', 'index'), q=TRUE))
#routlinkInfo$ind <- 1:nrow(routlinkInfo)
setnames(routlinkInfo, "index", "ind")

if (!is.null(comIds)) {
  routlinkInfoSub <- routlinkInfo[link %in% comIds]
  if (length(setdiff(comIds, routlinkInfoSub$link)) > 0 ) {
    print("Warning : The following ComIds are not in the Routlink, therefore no subsetting will be performed for them : ")
    print(setdiff(comIds, routlinkInfo$link))
  }
} else if (!is.null(gageIds)) {
  routlinkInfoSub <- routlinkInfo[trimws(gages) %in% gageIds]
  if (length(setdiff(gageIds, trimws(routlinkInfoSub$gages))) > 0 ) {
    print("Warning : The following gages are not in the Routlink, therefore no subsetting will be performed for them : ")
    print(setdiff(gageIds, trimws(routlinkInfoSub$gages)))
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


gather <- function(gageIdInd) {
  upBranches <- rwrfhydro:::GatherStreamInds(from, start = gageIdInd$gageInd, linkLength=reInd$length)
  indsAll <- c(upBranches$ind, upBranches$startInd)
  upComIds <- routlinkInfo[ind %in% indsAll, link]
  upComIds <- as.data.frame(upComIds)
}

upComIdsAll_df <- plyr::ldply(gageIndsList, gather, .parallel = FALSE)
names(upComIdsAll_df) <- c("outlet_comId", "upComIds")
if (!is.null(gageIds)) {
	upComIdsAll_df <- merge(upComIdsAll_df, routlinkInfoSub[, c("link", "gages"), with = FALSE], by.x = "outlet_comId", by.y = 'link')
        upComIdsAll_df$gages <- trimws(upComIdsAll_df$gages)
  
}

write.csv(upComIdsAll_df, file = paste0(myPath, "/upstreamComIds.csv"), row.names = FALSE)
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

infoDT$hyd_w <- floor((infoDT$hyd_w - 0.00001*dxy)/dxy)*dxy + 1
infoDT$hyd_s <- floor((infoDT$hyd_s - 0.00001*dxy)/dxy)*dxy + 1

infoDT$hyd_e <- ceiling((infoDT$hyd_e)/dxy)*dxy
infoDT$hyd_n <- ceiling((infoDT$hyd_n)/dxy)*dxy

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

#******** Then we need to add the geo_min, geo_max (the min and max row number when the 1,1 is upperRight corner) and the hydro information
infoDT[, `:=` (geo_min = dim(geohgt)[1] - geo_n + 1,
               geo_max = dim(geohgt)[1] - geo_s + 1 )]

infoDT[, `:=` (hyd_min = (geo_min-1)*dxy+1,
               hyd_max = geo_max*dxy)]

save(infoDT , file = paste0(myPath, "/infoDT.Rdata"))

#----------------------- Now is time to start the subsetting -------------------------------------------------------------------
# Here I (Arezoo) have not changes the infromation from the script Aubrey had, eventhough we do not need buffer anymore, 
# I kept it to be similar to what Aubrey had 

foreach (gage = unique(infoDT$.id), .export=ls(.GlobalEnv), .packages = c("data.table", "rwrfhydro", "ncdf4", "raster")) %do% {
  
  source("Utils_ReachFiles.R")
  
  # Get subsetting dimensions
  geo_w <- infoDT[.id == gage]$geo_w
  geo_e <- infoDT[.id == gage]$geo_e
  geo_s <- infoDT[.id == gage]$geo_s
  geo_n <- infoDT[.id == gage]$geo_n
  hyd_w <- infoDT[.id == gage]$hyd_w
  hyd_e <- infoDT[.id == gage]$hyd_e
  hyd_s <- infoDT[.id == gage]$hyd_s
  hyd_n <- infoDT[.id == gage]$hyd_n
  hyd_min <- infoDT[.id == gage]$hyd_min
  hyd_max <- infoDT[.id == gage]$hyd_max
  geo_min <- infoDT[.id == gage]$geo_min
  geo_max <- infoDT[.id == gage]$geo_max
  
  # Get relevant real coords for new bounds
  geo_min_col <- infoDT[.id == gage]$geo_w
  geo_max_col <- infoDT[.id == gage]$geo_e
  geo_min_row <- infoDT[.id == gage]$geo_min
  geo_max_row <- infoDT[.id == gage]$geo_max


  # get the center of the domain i and j index
  geo_cent_row <- dim(geohgt)[1] - (geo_s +  (geo_n - geo_s + 1)/2) + 1  ### We need to flip the north/south 
  geo_cent_col <- geo_w +  (geo_e - geo_w + 1)/2

  rowcol_new <- data.frame(id=c(1,2,3,4,5), row=c(geo_max_row, geo_min_row, geo_min_row, geo_max_row, geo_cent_row),
                           col=c(geo_min_col, geo_min_col, geo_max_col, geo_max_col, geo_cent_col))
  sp_new_proj <- xyFromCell(geohgt, raster::cellFromRowCol(geohgt, rowcol_new$row, rowcol_new$col), spatial=TRUE)
  sp_new_wrf <- sp::coordinates(sp::spTransform(sp_new_proj, "+proj=longlat +a=6370000 +b=6370000 +no_defs"))
  
  #---------------------------- write into 
  dx <- xres(geohgt)
  dy <- yres(geohgt)

  output <- data.frame(lat_center = sp_new_wrf[5, 2], 
                       lon_center = sp_new_wrf[5, 1], 
                       num_Row_J  = ceiling((dy / dxyDest) * (geo_e - geo_w + 1)),
                       num_Col_I  = ceiling((dx / dxyDest) * (geo_n - geo_s + 1)))
 
 print(output) 
}





