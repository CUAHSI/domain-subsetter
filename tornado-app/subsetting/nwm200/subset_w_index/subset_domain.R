# This script is to cutout a domain off the National Water Model given the x, y vlaues of the bounding box.

# Inputs:
  # myPath : The location in which author wants to save the cutout files 
  # The y_south, y_north, x_west, x_east : bounding x, and y s
  # The name of the files that the user wants to cutout
  # dxy : the multplier between the routing and LSM grid, for example if LSM is at 1 km, and routing is at 250 meter, dxy would be 4

# Output:
  # The cutout files
  # A copy of this script in the directory
  # 2 script for cutting out the Forcing files

# Authors:
  # Arezoo Rafieei Nasab (arezoo@ucar.edu)
  # Aubrey Dugger (adugger@ucar.edu)

#*******************************************************************************************************************************************
#                                   INPUTS 
#*******************************************************************************************************************************************

### CHANGE THESE VALUES ###

# Specify the path to your new subset domain files
myPath <- "/glade/u/home/arezoo/scratch/for/for_Mirce/subsetDomain"

# Specify the i, j index for the 4 bounding coordinate
# Keep in mind the lower left corner of the map is the 1,1 pixel (not the north left corner)

geo_w <- 43
geo_e <- 125
geo_s <- 12
geo_n <- 92

# Projection for bounding coordinates. This needs to be a PROJ4 string 
# (e.g., "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs").
        coordProj <- "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs"

# Multiplier between routing grid and LSM grid
# (e.g., 1-km LSM and 250-m routing means a value of 4)
        dxy <- 10

# Number of cells to buffer
        cellBuff <- 2

#******  Specify the path to the ORIGINAL (full extent) domain files: *****************
# If you do not want to subset any of the following files, assign it as NULL. 
# The fullGeoFile (Geogrid domain) is required at all times. 

# Path to the Routing domain file
fullHydFile <- "/glade/u/home/arezoo/scratch/for/for_Mirce/DOMAIN/Fulldom_hires.nc"

# Path to the Geogrid domain file
fullGeoFile <- "/glade/u/home/arezoo/scratch/for/for_Mirce/DOMAIN/geo_em.d04.nc"

# Path to the Wrfinput domain file
fullWrfFile <- "/glade/u/home/arezoo/scratch/for/for_Mirce/DOMAIN/wrfinput_newhyd.nc"

# Path to the Routelink file
fullRtlinkFile <- NULL

# Path to the Spatial weights file
fullSpwtFile <- NULL

# Path to the GW bucket parameter file
fullGwbuckFile <- "/glade/u/home/arezoo/scratch/for/for_Mirce/DOMAIN/GWBUCKPARM.nc"
fullGwbuckFile <- NULL
# Path to the Soil parameter file
fullSoilparmFile <- "/glade/u/home/arezoo/scratch/for/for_Mirce/DOMAIN/soil_properties.nc"

# Path to the Lake parameter file
fullLakeparmFile <- NULL

# Path to the hydro2D file , set this to NULL if you do not have a hydro 2D file
fullHydro2dFile <- "/glade/u/home/arezoo/scratch/for/for_Mirce/DOMAIN/hydro2dtbl.nc.ALL"

# Path to the geo spatial file required for the new outputting option
geoSpatialFile <-  NULL

# Path to the nudging param file
fullNudgeParamFile <- NULL

#************************************************************************************************************************************************
#             No need to modify anything from here 
#***********************************************************************************************************************************************

# creat the outPath if does not exist.
dir.create(myPath)

# Specify the NEW (subset extent) domain files:

# Routing domain file
subHydFile <- paste0(myPath, "/Fulldom.nc")

# Geogrid domain file
subGeoFile <- paste0(myPath, "/geo_em.nc")

# Wrfinput domain file
subWrfFile <- paste0(myPath, "/wrfinput.nc")

# Route link file
subRtlinkFile <- paste0(myPath, "/RouteLink.nc")

# Spatial weights file
subSpwtFile <- paste0(myPath, "/spatialweights.nc")

# GW bucket parameter file
subGwbuckFile <- paste0(myPath, "/GWBUCKPARM.nc")

# Soil parameter file
subSoilparmFile <- paste0(myPath, "/soil_properties.nc")

# Lake parameter file
subLakeparmFile <- paste0(myPath, "/LAKEPARM.nc")
       
#Hydro 2d file
subHydro2dFile <- paste0(myPath, "/HYDRO_TBL_2D.nc")
	
# geo Spatial file
subGeoSpatialFile <- paste0(myPath, "/geospatial_data_template_land_GIS.nc")

# Coordinate parameter text file
subCoordParamFile <- paste0(myPath, "/params.txt")

# Nudging parameter
subNudgeParamFile <- paste0(myPath, "/nudgingParams.nc")

# Forcing clip script file
subScriptFile <- paste0(myPath, "/script_forcing_subset.txt")


################ PROCESSING #####################

################ CALCULATE INDICES

library(rwrfhydro)
library(ncdf4)
source("Utils_ReachFiles.R")

# Get subsetting dimensions
hyd_w <- (geo_w-1)*dxy+1
hyd_e <- geo_e*dxy
hyd_s <- (geo_s-1)*dxy+1
hyd_n <- geo_n*dxy

# read the dimension of the GeoDomain file: 
nrows <- dim(rwrfhydro::GetNcdfFile(fullGeoFile, "HGT_M", quiet = TRUE)$HGT_M)[2]

hyd_min <- nrows*dxy - hyd_n + 1
hyd_max <- nrows*dxy - hyd_s + 1
#geo_min <- min(geoindex$row)
#geo_max <- max(geoindex$row)

print(paste0("hyd_w : ", hyd_w, " hyd_e : ", hyd_e, " hyd_s : ", hyd_s, " hyd_n : ", hyd_n))

################# SUBSET DOMAINS

# NCO starts with 0 index for dimensions, so we have to subtract 1

# ROUTING GRID
if (!is.null(fullHydFile)) {

   if  (!file.exists(fullHydFile)) stop(paste0("The fullHydFile : ", fullHydFile, " does not exits"))
   cmd <- paste0("ncks -O -d x,", hyd_w-1, ",", hyd_e-1, " -d y,", hyd_min-1, ",", hyd_max-1, " ", fullHydFile, " ", subHydFile)
   print(cmd)
   system(cmd)
}

# Geo Spatial File 
if (!is.null(geoSpatialFile)) {

   if (!file.exists(geoSpatialFile)) stop(paste0("The geoSpatialFile :", geoSpatialFile, " does not exits"))
   cmd <- paste0("ncks -O -d x,", geo_w-1, ",", geo_e-1, " -d y,", geo_s-1, ",", geo_n-1, " ", geoSpatialFile, " ", subGeoSpatialFile)
   print(cmd)
   system(cmd)
}


# GEO GRID

# Dimension subsetting
cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, 
	       " -d west_east_stag,", geo_w-1, ",", geo_e, " -d south_north_stag,",geo_s-1, ",", geo_n, " ",
		fullGeoFile, " ", subGeoFile)
print(cmd)
system(cmd)

# This part is been added by Kevin s request to provide the corner_lons and corner_lats as the GIS tools need
# with the WPS standards

# Read the 2D corner coordinates
corner_lats <- c()
for (ncVarName in c('XLAT_M', 'XLAT_U', 'XLAT_V', 'XLAT_C')) {
        if (ncVarName %in% names(rwrfhydro::ncdump(subGeoFile, quiet = TRUE)$var)) {
            a = rwrfhydro::ncdump(subGeoFile, variable = ncVarName, quiet = TRUE)
            corners = c(a[1,1], a[1, ncol(a)], a[nrow(a), ncol(a)], a[nrow(a), 1])
            rm(a)
        }else{
            corners = c(0,0,0,0)
	}
        corner_lats = c(corner_lats, corners)                           # Populate corner_lats lis
}

corner_lons <- c()
for (ncVarName in c('XLONG_M', 'XLONG_U', 'XLONG_V', 'XLONG_C')) {
        if (ncVarName %in% names(rwrfhydro::ncdump(subGeoFile, quiet = TRUE)$var)) {
            a = rwrfhydro::ncdump(subGeoFile, variable = ncVarName, quiet = TRUE)
            corners = c(a[1,1], a[1, ncol(a)], a[nrow(a), ncol(a)], a[nrow(a), 1])
            rm(a)
        }else{
            corners = c(0,0,0,0)
        }
        corner_lons = c(corner_lons, corners)                           # Populate corner_lats lis
}


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
#cmd <- paste0("ncatted -h -a corner_lons,global,o,f,", sp_new_wrf[1,1], " ", subGeoFile)
#system(cmd)
#cmd <- paste0("ncatted -h -a corner_lats,global,o,f,", sp_new_wrf[1,2], " ", subGeoFile)
#system(cmd)

cmd <- paste0("ncatted -O -a corner_lons,global,o,f,", paste(corner_lons, collapse  = ","), " ", subGeoFile)
system(cmd)
cmd <- paste0("ncatted -O -a corner_lats,global,o,f,", paste(corner_lats, collapse  = ","), " ", subGeoFile)
system(cmd)



#HYDRO_TBL_2D GRID
if (!is.null(fullHydro2dFile)) {

   if (!file.exists(fullHydro2dFile)) stop(paste0("The fullHydro2dFile : ", fullHydro2dFile, " does not exits"))
  
   # Dimension subsetting
   #DIMENSION IS CURRENTLY north_south.. may change this after talking with Wei 04/28/2017
   cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullHydro2dFile, " ", subHydro2dFile)
   print(cmd)
   system(cmd)
}

# WRFINPUT GRID

if (!is.null(fullWrfFile)) {

  if (!file.exists(fullWrfFile)) stop(paste0("The fullWrfFile : ", fullWrfFile, " does not exits"))

  cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullWrfFile, " ", subWrfFile)
  print(cmd)
  system(cmd)
  # Attribute updates
  cmd <- paste0("ncatted -h -a WEST-EAST_GRID_DIMENSION,global,o,l,", geo_e-geo_w+2, " ", subWrfFile)
  system(cmd)
  cmd <- paste0("ncatted -h -a SOUTH-NORTH_GRID_DIMENSION,global,o,l,", geo_n-geo_s+2, " ", subWrfFile)
  system(cmd)
}

################# SUBSET PARAMS

if (!is.null(fullSpwtFile) & !is.null(fullRtlinkFile)) {

  if (!file.exists(fullSpwtFile)) stop(paste0("The fullSpwtFile : ", fullSpwtFile, " does not exits"))
  if (!file.exists(fullRtlinkFile)) stop(paste0("The fullRtlinkFile : ", fullRtlinkFile, " does not exits"))

   # Identify catchments to keep

   fullWts <- ReadWtFile(fullSpwtFile)
   keepIdsPoly <- subset(fullWts[[1]], fullWts[[1]]$i_index >= hyd_w & fullWts[[1]]$i_index <= hyd_e &
       			fullWts[[1]]$j_index >= hyd_s & fullWts[[1]]$j_index <= hyd_n)
   keepIdsPoly <- unique(keepIdsPoly$IDmask)

   fullRtlink <- ReadLinkFile(fullRtlinkFile)
   #keepIdsLink <- subset(fullRtlink, fullRtlink$lon >= min(sp_new_buff_nad83[,1]) & fullRtlink$lon <= max(sp_new_buff_nad83[,1]) &
   #			fullRtlink$lat >= min(sp_new_buff_nad83[,2]) & fullRtlink$lat <= max(sp_new_buff_nad83[,2]))
   keepIdsLink <- subset(fullRtlink, fullRtlink$x >= x_west & fullRtlink$x <= x_east &
                         fullRtlink$y >= y_south & fullRtlink$y <= y_north)
   keepIdsLink <- unique(keepIdsLink$link)

   keepIds <- unique(c(keepIdsPoly, keepIdsLink))

   # SPATIAL WEIGHT

   subWts <- SubsetWts(fullWts, keepIdsPoly, hyd_w, hyd_e, hyd_s, hyd_n)
   file.copy(fullSpwtFile, subSpwtFile, overwrite = TRUE)
   UpdateWtFile(subSpwtFile, subWts[[1]], subWts[[2]], subDim=TRUE)

   # ROUTE LINK

   subRtlink <- subset(fullRtlink, fullRtlink$link %in% keepIds)
   subRtlink$to <- ifelse(subRtlink$to %in% unique(subRtlink$link), subRtlink$to, 0)
   # reorder the ascendingIndex if ascendingIndex exists in the variables
   if ("ascendingIndex" %in% names(subRtlink)) subRtlink$ascendingIndex <- (rank(subRtlink$ascendingIndex) - 1)
   file.copy(fullRtlinkFile, subRtlinkFile, overwrite = TRUE)
   UpdateLinkFile(subRtlinkFile, subRtlink, subDim=TRUE)
}

# GWBUCK PARAMETER

if (!is.null(fullGwbuckFile)) {

   if (is.null(fullSpwtFile) | is.null(fullRtlinkFile)) {
      stop("To subset the fullSpwtFile, you need fullSpwtFile and fullRtlinkFile")
   }
   if (!file.exists(fullGwbuckFile)) stop(paste0("the fullGwbuckFile : ", fullGwbuckFile, " does not exits"))
   fullGwbuck <- GetNcdfFile(fullGwbuckFile, quiet=TRUE)
   subGwbuck <- subset(fullGwbuck, fullGwbuck$ComID %in% keepIdsPoly)
   subGwbuck$Basin <- seq(1, nrow(subGwbuck), 1)
   file.copy(fullGwbuckFile, subGwbuckFile, overwrite = TRUE)
   UpdateGwbuckFile(subGwbuckFile, subGwbuck, subDim=TRUE)
}

# SOIL PARAMETER

if (!is.null(fullSoilparmFile)) {

    if (!file.exists(fullSoilparmFile)) stop(paste0("the fullSoilparmFile : ", fullSoilparmFile, " does not exits"))
    cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullSoilparmFile, " ", subSoilparmFile)
    system(cmd)
}

# LAKE PARAMETER

# Make a copy of the LAKEPARM file, Read the subsetted Routlink file 
# and finds out which lakes fall into the domain and keep only those in the LAKEPARM.nc file

if (!is.null(fullLakeparmFile)) {
   
   if (is.null(fullSpwtFile) | is.null(fullRtlinkFile)) {
      stop("To subset the fullLakeparmFile, you need fullSpwtFile and fullRtlinkFile")
   }
   if (!file.exists(fullLakeparmFile)) stop(paste0("the fullLakeparmFile : ", fullLakeparmFile, " does not exits"))
   rl <- ReadRouteLink(subRtlinkFile)
   rll <- subset(rl, rl$NHDWaterbodyComID>=0)
   lk <- GetNcdfFile(fullLakeparmFile)
   lkl <- subset(lk, lk$lake_id %in% rll$NHDWaterbodyComID)

   if (nrow(lkl) != 0) {
      file.copy(fullLakeparmFile, subLakeparmFile, overwrite = TRUE)
      UpdateLakeFile(subLakeparmFile, lkl, subDim=TRUE)
   }  
}

# Nudging PARAMETER FILE, not tested yet

if (!is.null(fullNudgeParamFile)) {

   if (is.null(fullSpwtFile) | is.null(fullRtlinkFile)) {
      stop("To subset the fullNudgeParamFile, you need fullSpwtFile and fullRtlinkFile")
   }
   if (!file.exists(fullNudgeParamFile)) stop(paste0("The fullNudgeParamFile : ", fullNudgeParamFile, " does not exist"))
 
   file.copy(fullNudgeParamFile, subNudgeParamFile, overwrite = TRUE)
   # read the list of gages from the subsetted Routlink
   RtGages <- unique(rwrfhydro::ncdump(subRtlinkFile, "gages", quiet = TRUE))
   # read the list of all gages from the full nudging param file
   nudgeGages <- rwrfhydro::ncdump(fullNudgeParamFile, "stationId", quiet = TRUE)
   # Find the indices for which will be used from subsetting
   subRtlinkInds <- which(nudgeGages %in% RtGages)
   # read the nudging param file in, and subset them
   nudgeInfo <- rwrfhydro::GetNcdfFile(fullNudgeParamFile, quiet=TRUE)
   for (varName in c("stationId", "R", "G", "tau")){ nudgeInfo[[varName]] <- nudgeInfo[[varName]][subRtlinkInds]}
   nudgeInfo$qThresh <- nudgeInfo$qThresh[, subRtlinkInds]
   nudgeInfo$expCoeff <- nudgeInfo$expCoeff[,, subRtlinkInds]

   # reduce the size of the file
   cmdtxt <- paste0("ncks -O -d stationIdInd,1,",  length(subRtlinkInds), " ", subNudgeParamFile, " ", subNudgeParamFile)
   system(cmdtxt)

   # read all the variables with link as their dimension (only dimension) and subset the link dimension
   ncin <- ncdf4::nc_open(subNudgeParamFile, write=TRUE)
   for (i in names(nudgeInfo)) {
#      print(i)
       ncdf4::ncvar_put(ncin, i, nudgeInfo[[i]])
   }
   ncdf4::nc_close(ncin)
}

################# CREATE SCRIPT FILES

# Save the coordinate parameter file
if (FALSE) {
coordsExport <- data.frame(grid=c("hyd_sn", "hyd_ns", "geo_sn", "geo_ns"),
                            imin=c(hyd_w, hyd_w, geo_w, geo_w),
                            imax=c(hyd_e, hyd_e, geo_e, geo_e),
                            jmin=c(hyd_s, hyd_min, geo_s, geo_min),
                            jmax=c(hyd_n, hyd_max, geo_n, geo_max),
                            index_start=c(1,1,1,1))
write.table(coordsExport, file=subCoordParamFile, row.names=FALSE, sep="\t")
}
# Save the forcing subset script file
#ncksCmd <- paste0("ncks -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ${OLDFORCPATH}/${i} ${NEWFORCPATH}/${i}")
ncksCmd <- paste0("ncks -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ${i} ${NEWFORCPATH}/${i##*/}")
fileConn <- file(subScriptFile)
writeLines(c("#!/bin/bash",
		"OLDFORCPATH='PATH_TO_OLD_FORCING_DATA_FOLDER'",
		"NEWFORCPATH='PATH_TO_NEW_FORCING_DATA_FOLDER'",
		"for i in `ls $OLDFORCPATH`; do",
		"echo ${i##*/}",
		ncksCmd,
		"done"),
		fileConn)
close(fileConn)

ncksCmd <- paste0("ncks -d ncl0,", geo_s-1, ",", geo_n-1, " -d ncl1,", geo_w-1, ",", geo_e-1, " -d ncl2,", geo_s-1, ",", geo_n-1, " -d ncl3,", geo_w-1, ",", geo_e-1, " -d ncl4,", geo_s-1, ",", geo_n-1, " -d ncl5,", geo_w-1, ",", geo_e-1, " -d ncl6,", geo_s-1, ",", geo_n-1, " -d ncl7,", geo_w-1, ",", geo_e-1, " -d ncl8,", geo_s-1, ",", geo_n-1, " -d ncl9,", geo_w-1, ",", geo_e-1, " -d ncl10,", geo_s-1, ",", geo_n-1, " -d ncl11,", geo_w-1, ",", geo_e-1, " -d ncl12,", geo_s-1, ",", geo_n-1, " -d ncl13,", geo_w-1, ",", geo_e-1, " -d ncl14,", geo_s-1, ",", geo_n-1, " -d ncl15,", geo_w-1, ",", geo_e-1, " ${i} ${NEWFORCPATH}/${i##*/}")
fileConn <- file(paste0(subScriptFile, "_NWM_REALTIME"))
writeLines(c("#!/bin/bash",
                "OLDFORCPATH='PATH_TO_OLD_FORCING_DATA_FOLDER'",
                "NEWFORCPATH='PATH_TO_NEW_FORCING_DATA_FOLDER'",
                "for i in `ls $OLDFORCPATH`; do",
                "echo ${i##*/}",
                ncksCmd,
                "done"),
                fileConn)
close(fileConn)

# copy this script to the myPath dir, so the user haev from what files this cutout has been generated, and what are the options.

file.copy(from = paste0(getwd(), "/subset_domain.R"), to = paste0(myPath, "/subset_domain.R"), overwrite = TRUE)


#quit("no")

