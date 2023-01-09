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
  # Aubrey Dugger (adugger@ucar.edu)
  # Arezoo Rafieei Nasab (arezoo@ucar.edu)
  # edited by Anthony Castronova (acastronova@cuahsi.org) November 2020

library(rwrfhydro)
library(ncdf4)
library(data.table)
source("Utils_ReachFiles.R")

# Test with
#y south: 382582.18746
#y north: 367584.87840
#x west: 1720355.72762
#x east: 1734488.45260

subsetBbox <- function(guid, y_south, y_north, x_west, x_east, domain_path, out_path) {

#    cat("hello world")

    # guid: unique identifier used to name the output
    # Specify the clip bounding coordinates
    # they are the x, y values with respect to the projection specified above.
    # For example, the y_south is the y value of the most southern part of the 
    # domain you want to subset have in the lambert conformal conic projection
    # used in the National Water Model (in meters)


    # Specify the path to your new subset domain files
    myPath <- paste0(out_path,"/", guid)

    # Specify the path to the FULL DOMAIN files
    domainPath <- domain_path

    # Projection for bounding coordinates. This needs to be a PROJ4 string 
    # (e.g., "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs").
    coordProj <- "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs"

    # Specify the clip bounding coordinates: they are the x, y values with 
    # respect to the projection specified above. For example, the y_south 
    # is the y value of the most southern part of the domain you want to subset have
    # in the lambert conformal conic projection used in the National Water Model
    # (in meters)
    cat("std:R Inputs")
    cat("std:y south (IN):", y_south, sep=' ')
    cat("std:y north (IN):", y_north, sep=' ')
    cat("std:x west: (IN)", x_west, sep=' ')
    cat("std:x east: (IN)", x_east, sep=' ')

    # Multiplier between routing grid and LSM grid
    # (e.g., 1-km LSM and 250-m routing means a value of 4)
    dxy <- 4
    
    # Number of cells to buffer
    cellBuff <- 2

    # ******  Specify the path to the ORIGINAL (full extent) domain files: ********
    # If you do not want to subset any of the following files, assign it as NULL. 
    # The fullGeoFile (Geogrid domain) is required at all times. 

    # NOTE: Fulldom_hires.nc doesn't exist, should I use 1km or 250m?
    # Path to the Routing domain file
    fullHydFile <- paste0(domainPath, "/Fulldom_hires_netcdf_250m.nc")
    
    # Path to the Geogrid domain file
    fullGeoFile <- paste0(domainPath, "/geo_em.d01_1km.nc")
    
    # Path to the Wrfinput domain file
    fullWrfFile <- paste0(domainPath, "/wrfinput_d01_1km.nc")
    
    # Path to the Routelink file
    #fullRtlinkFile <- NULL
    fullRtlinkFile <- paste0(domainPath, "/RouteLink_NHDPLUS.nc")
    
    # Path to the Spatial weights file
    #fullSpwtFile <- NULL
    fullSpwtFile <- paste0(domainPath, "/spatialweights_250m_all_basins.nc")
    
    # Path to the GW bucket parameter file
    fullGwbuckFile <- paste0(domainPath, "/GWBUCKPARM_CONUS.nc")
    
    # Path to the Soil parameter file
    fullSoilparmFile <- paste0(domainPath, "/soil_veg_properties_ASM.nc")
    
    # Path to the Lake parameter file
    fullLakeparmFile <- NULL
    
    ## Path to the re expression files, only required if LAKEPARM is not null
    #
    #downstreamReExpFile <- "/PATH/TO/RouteLink.reExpTo.Rdb"
    #upstreamReExpFile   <- "/PATH/TO/RouteLink.reExpFrom.Rdb"
    #reIndFile           <- "/PATH/TO/RouteLink.reInd.Rdb"
    
    # Path to the hydro2D file , set this to NULL if you do not have a hydro 2D file
    fullHydro2dFile <- paste0(domainPath, "/HYDRO_TBL_2D.nc")
    
    # Path to the geo spatial file required for the new outputting option
    #geoSpatialFile <-  NULL
    # NOTE: is this the geospatial file?
    geoSpatialFile <-  paste0(domainPath, "/WRF_Hydro_NWM_geospatial_data_template_land_GIS.nc")
    
    # Path to the nudging param file
    fullNudgeParamFile <- NULL
#    fullNudgeParamFile <- paste0(domainPath, "/nudgingParams.nc")
    
    

    #*******************************************************************
    #             No need to modify anything from here 
    #*******************************************************************
    
    # create the outPath if does not exist.
    dir.create(myPath)
    
    # Specify the NEW (subset extent) domain files:
    
    # Routing domain file
    subHydFile <- paste0(myPath, "/Fulldom_hires.nc")
    
    # Geogrid domain file
    subGeoFile <- paste0(myPath, "/geo_em.d0x.nc")
    
    # Wrfinput  file
    subWrfFile <- paste0(myPath, "/wrfinput_d0x.nc")
    
    # Route link file
    subRtlinkFile <- paste0(myPath, "/Route_Link.nc")
    
    # Spatial weights file
    subSpwtFile <- paste0(myPath, "/spatialweights.nc")
    
    # GW Bucket parameter file
    subGwbuckFile <- paste0(myPath, "/GWBUCKPARM.nc")
    
    # Soil parameter file
    subSoilparmFile <- paste0(myPath, "/soil_properties.nc")
    
    # Lake parameter file
    subLakeparmFile <- paste0(myPath, "/LAKEPARM.nc")
           
    #Hydro 2d file
    subHydro2dFile <- paste0(myPath, "/hydro2dtbl.nc")
    	
    # geo Spatial file
    subGeoSpatialFile <- paste0(myPath, "/GEOGRID_LDASOUT_Spatial_Metadata.nc")
    
    # Coordinate parameter text file
    subCoordParamFile <- paste0(myPath, "/params.txt")
    
    # Nudging parameter
    subNudgeParamFile <- paste0(myPath, "/nudgingParams.nc")
    
    # Forcing clip script file
    subScriptFile <- paste0(myPath, "/script_forcing_subset.txt")
    

    ################ PROCESSING #####################

    ################ CALCULATE INDICES


    # Setup coordinates df
    coords <- data.frame(id=c(1,2,3,4), lat=c(y_south, y_north, y_north, y_south),
            lon=c(x_west, x_west, x_east, x_east))
    
    # Create temp geogrid tif
    tmpfile <- tempfile(fileext=".tif")
    ExportGeogrid(fullGeoFile, "HGT_M", tmpfile)
    geohgt <- raster::raster(tmpfile)
    file.remove(tmpfile)
    
    # Generate spatial coords
    sp <- sp::SpatialPoints(data.frame(x=coords[,"lon"], y=coords[,"lat"]))
    raster::crs(sp) <- coordProj
    sp_proj <- sp::spTransform(sp, crs(geohgt))
    geoindex <- as.data.frame(raster::rowColFromCell(geohgt, raster::cellFromXY(geohgt, sp_proj)))
    geoindex$we <- geoindex$col
    
    # Change row count from N->S to S->N
    geoindex$sn <- dim(geohgt)[1] - geoindex$row + 1
    geoindex$id <- coords[,"id"]
    
    # Get subsetting dimensions
    geo_w <- min(geoindex[,"we"])
    geo_e <- max(geoindex[,"we"])
    geo_s <- min(geoindex[,"sn"])
    geo_n <- max(geoindex[,"sn"])
    hyd_w <- (geo_w-1)*dxy+1
    hyd_e <- geo_e*dxy
    hyd_s <- (geo_s-1)*dxy+1
    hyd_n <- geo_n*dxy
    hyd_min <- (min(geoindex$row)-1)*dxy+1
    hyd_max <- max(geoindex$row)*dxy
    geo_min <- min(geoindex$row)
    geo_max <- max(geoindex$row)
    
    print(paste0("hyd_w : ", hyd_w, " hyd_e : ", hyd_e, " hyd_s : ", hyd_s, " hyd_n : ", hyd_n))
    
    # Get relevant real coords for new bounds
    geo_min_col <- min(geoindex[,"col"])
    geo_max_col <- max(geoindex[,"col"])
    geo_min_row <- min(geoindex[,"row"])
    geo_max_row <- max(geoindex[,"row"])
    rowcol_new <- data.frame(id=c(1,2,3,4), row=c(geo_max_row, geo_min_row, geo_min_row, geo_max_row),
            col=c(geo_min_col, geo_min_col, geo_max_col, geo_max_col))
    rowcol_new_buff <- data.frame(id=c(1,2,3,4), row=c(geo_max_row+cellBuff, geo_min_row-cellBuff, geo_min_row-cellBuff, geo_max_row+cellBuff),
            col=c(geo_min_col-cellBuff, geo_min_col-cellBuff, geo_max_col+cellBuff, geo_max_col+cellBuff))
    sp_new_proj <- xyFromCell(geohgt, raster::cellFromRowCol(geohgt, rowcol_new$row, rowcol_new$col), spatial=TRUE)
    sp_new_proj_buff <- xyFromCell(geohgt, raster::cellFromRowCol(geohgt, rowcol_new_buff$row, rowcol_new_buff$col), spatial=TRUE)
    sp_new_wrf <- sp::coordinates(sp::spTransform(sp_new_proj, "+proj=longlat +a=6370000 +b=6370000 +no_defs"))
    sp_new_nad83 <- sp::coordinates(sp::spTransform(sp_new_proj, "+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs"))
    sp_new_buff_wrf <- sp::coordinates(sp::spTransform(sp_new_proj_buff, "+proj=longlat +a=6370000 +b=6370000 +no_defs"))
    sp_new_buff_nad83 <- sp::coordinates(sp::spTransform(sp_new_proj_buff, "+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs"))
    
    
    ################# SUBSET DOMAINS
    
    # NCO starts with 0 index for dimensions, so we have to subtract 1
    
    # Geo Spatial File
    if (!is.null(geoSpatialFile)) {
       print("Processing Geo Spatial File")
    
       if (!file.exists(geoSpatialFile)) stop(paste0("The geoSpatialFile :", geoSpatialFile, " does not exits"))
         cmd <- paste0("ncks -O -d x,", geo_w-1, ",", geo_e-1, " -d y,", geo_min-1, ",", geo_max-1, " ", geoSpatialFile, " ", subGeoSpatialFile)
       print(cmd)
       system(cmd)
    
       # read in the x and y values of the cutout domain
       xy_data <- rwrfhydro::GetNcdfFile(subGeoSpatialFile, q = TRUE)
    
       # let s modify the GeoTransform attribute of variable crs in the geoSpatialFile
       cmd <- paste0("ncatted -O -a GeoTransform,crs,o,c,'", xy_data$x[1] - attributes(xy_data)$x$resolution/2, " ",
                     attributes(xy_data)$x$resolution, " 0 ", xy_data$y[1] + attributes(xy_data)$y$resolution/2, " 0 ",
                     attributes(xy_data)$y$resolution,"' ", subGeoSpatialFile)
       print(cmd)
       system(cmd)
    }
    
    # ROUTING GRID
    if (!is.null(fullHydFile)) {
       print("Processing Routing Grid")
    
       if  (!file.exists(fullHydFile)) stop(paste0("The fullHydFile : ", fullHydFile, " does not exits"))
       cmd <- paste0("ncks -O -d x,", hyd_w-1, ",", hyd_e-1, " -d y,", hyd_min-1, ",", hyd_max-1, " ", fullHydFile, " ", subHydFile)
       print(cmd)
       system(cmd)
    
       # read in the x and y values of the cutout domain
       xy_data2 <- rwrfhydro::GetNcdfFile(subHydFile, q = TRUE)
    
       # let s modify the GeoTransform attribute of variable crs in the geoSpatialFile
       cmd <- paste0("ncatted -O -a GeoTransform,crs,o,c,'", xy_data2$x[1] - attributes(xy_data)$x$resolution/2/dxy, " ", # Move from Center to the upper left corner
                     attributes(xy_data)$x$resolution/dxy, " 0 ", xy_data2$y[1] + attributes(xy_data)$y$resolution/2/dxy, " 0 ",
                     attributes(xy_data)$y$resolution/dxy, "' ", subHydFile)
       print(cmd)
       system(cmd)
    }
    
    # GEO GRID
    
    # Dimension subsetting
    print("Processing GeoGrid")
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
    cmd <- paste0("ncatted -O -a corner_lons,global,o,f,", paste(corner_lons, collapse  = ","), " ", subGeoFile)
    system(cmd)
    cmd <- paste0("ncatted -O -a corner_lats,global,o,f,", paste(corner_lats, collapse  = ","), " ", subGeoFile)
    system(cmd)
    
    #HYDRO_TBL_2D GRID
    if (!is.null(fullHydro2dFile)) {
       print("Processing Hydro Table")
    
       if (!file.exists(fullHydro2dFile)) stop(paste0("The fullHydro2dFile : ", fullHydro2dFile, " does not exits"))
      
       # Dimension subsetting
       #DIMENSION IS CURRENTLY north_south.. may change this after talking with Wei 04/28/2017
       cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullHydro2dFile, " ", subHydro2dFile)
       print(cmd)
       system(cmd)
    
       # Attribute updates
       cmd <- paste0("ncatted -h -a WEST-EAST_GRID_DIMENSION,global,o,l,", geo_e-geo_w+2, " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a SOUTH-NORTH_GRID_DIMENSION,global,o,l,", geo_n-geo_s+2, " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_UNSTAG,global,o,l,", geo_e-geo_w+1, " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_UNSTAG,global,o,l,", geo_n-geo_s+1, " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_START_STAG,global,d,,, ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_START_STAG,global,d,,, ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_STAG,global,d,,, ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_STAG,global,d,,, ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a i_parent_end,global,o,l,", geo_e-geo_w+2, " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -h -a j_parent_end,global,o,l,", geo_n-geo_s+2, " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -O -a corner_lons,global,o,f,", paste(corner_lons, collapse  = ","), " ", subHydro2dFile)
       system(cmd)
       cmd <- paste0("ncatted -O -a corner_lats,global,o,f,", paste(corner_lats, collapse  = ","), " ", subHydro2dFile)
       system(cmd)
    }
    
    # WRFINPUT GRID
    
    if (!is.null(fullWrfFile)) {
      print("Processing WRF Input Grid")
    
      if (!file.exists(fullWrfFile)) stop(paste0("The fullWrfFile : ", fullWrfFile, " does not exits"))
    
      cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullWrfFile, " ", subWrfFile)
      print(cmd)
      system(cmd)
    
      # Attribute updates
      cmd <- paste0("ncatted -h -a WEST-EAST_GRID_DIMENSION,global,o,l,", geo_e-geo_w+2, " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a SOUTH-NORTH_GRID_DIMENSION,global,o,l,", geo_n-geo_s+2, " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_UNSTAG,global,o,l,", geo_e-geo_w+1, " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_UNSTAG,global,o,l,", geo_n-geo_s+1, " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_START_STAG,global,d,,, ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_START_STAG,global,d,,, ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_STAG,global,d,,, ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_STAG,global,d,,, ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a i_parent_end,global,o,l,", geo_e-geo_w+2, " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -h -a j_parent_end,global,o,l,", geo_n-geo_s+2, " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -O -a corner_lons,global,o,f,", paste(corner_lons, collapse  = ","), " ", subWrfFile)
      system(cmd)
      cmd <- paste0("ncatted -O -a corner_lats,global,o,f,", paste(corner_lats, collapse  = ","), " ", subWrfFile)
      system(cmd)
    }
    
    ################# SUBSET PARAMS
    
    if (!is.null(fullSpwtFile) & !is.null(fullRtlinkFile)) {
      
      print("Processing Parameters")
    
      if (!file.exists(fullSpwtFile)) stop(paste0("The fullSpwtFile : ", fullSpwtFile, " does not exits"))
      if (!file.exists(fullRtlinkFile)) stop(paste0("The fullRtlinkFile : ", fullRtlinkFile, " does not exits"))
    
       # Identify catchments to keep
    
       fullWts <- ReadWtFile(fullSpwtFile)
       keepIdsPoly <- subset(fullWts[[1]], fullWts[[1]]$i_index >= hyd_w & fullWts[[1]]$i_index <= hyd_e &
           			fullWts[[1]]$j_index >= hyd_s & fullWts[[1]]$j_index <= hyd_n)
    #   keepIdsPoly <- unique(keepIdsPoly$IDmask)  !!! this was commented out since I have added the below check to make sure all the basin falls in the cutout domain
    
       # keep only those basins that are fully within the cutout doamin
       FullBasins <- as.data.table(keepIdsPoly)
       FullBasins <- FullBasins[, .(sumBas = sum(weight)), by = IDmask] # find How much of the basins are in the cutout domain
       keepIdsPoly <- FullBasins[sumBas > .999]$IDmask
    
       fullRtlink <- ReadLinkFile(fullRtlinkFile)
       keepIdsLink <- subset(fullRtlink, fullRtlink$lon >= min(sp_new_buff_nad83[,1]) & fullRtlink$lon <= max(sp_new_buff_nad83[,1]) &
       			fullRtlink$lat >= min(sp_new_buff_nad83[,2]) & fullRtlink$lat <= max(sp_new_buff_nad83[,2]))
    #   keepIdsLink <- subset(fullRtlink, fullRtlink$x >= x_west & fullRtlink$x <= x_east &
    #                         fullRtlink$y >= y_south & fullRtlink$y <= y_north)
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
       print("Processing GW Bucket")
    
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
    
       print("Processing Soil Parameters")
        if (!file.exists(fullSoilparmFile)) stop(paste0("the fullSoilparmFile : ", fullSoilparmFile, " does not exits"))
        cmd <- paste0("ncks -O -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ", fullSoilparmFile, " ", subSoilparmFile)
        system(cmd)
    
        # Attribute updates
        cmd <- paste0("ncatted -h -a WEST-EAST_GRID_DIMENSION,global,o,l,", geo_e-geo_w+2, " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a SOUTH-NORTH_GRID_DIMENSION,global,o,l,", geo_n-geo_s+2, " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_UNSTAG,global,o,l,", geo_e-geo_w+1, " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_UNSTAG,global,o,l,", geo_n-geo_s+1, " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_START_STAG,global,d,,, ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_START_STAG,global,d,,, ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a WEST-EAST_PATCH_END_STAG,global,d,,, ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a SOUTH-NORTH_PATCH_END_STAG,global,d,,, ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a i_parent_end,global,o,l,", geo_e-geo_w+2, " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -h -a j_parent_end,global,o,l,", geo_n-geo_s+2, " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -O -a corner_lons,global,o,f,", paste(corner_lons, collapse  = ","), " ", subSoilparmFile)
        system(cmd)
        cmd <- paste0("ncatted -O -a corner_lats,global,o,f,", paste(corner_lats, collapse  = ","), " ", subSoilparmFile)
        system(cmd)
    }
    
    # LAKE PARAMETER
    
    # Make a copy of the LAKEPARM file, Read the subsetted Routlink file 
    # and finds out which lakes fall into the domain and keep only those in the LAKEPARM.nc file
    if (!is.null(fullLakeparmFile)) {
       print("Processing Lake Parameters")
    
       if (is.null(fullSpwtFile) | is.null(fullRtlinkFile)) {
          stop("To subset the fullLakeparmFile, you need fullSpwtFile and fullRtlinkFile")
       }
       if (!file.exists(fullLakeparmFile)) stop(paste0("the fullLakeparmFile : ", fullLakeparmFile, " does not exits"))
       rl <- ReadRouteLink(subRtlinkFile)
       rll <- subset(rl, rl$NHDWaterbodyComID>0)
       lk <- GetNcdfFile(fullLakeparmFile, quiet=TRUE)
       lkl <- subset(lk, lk$lake_id %in% rll$NHDWaterbodyComID)
    
       load(downstreamReExpFile)
       load(upstreamReExpFile)
       load(reIndFile)
    
       # Identify lake outlets for full domain
       rl.full <- ReadRouteLink(fullRtlinkFile)
       rl.full$ind <- 1:nrow(rl.full)
       lakeTypes <- GetNcdfFile(fullLakeTypesFile, quiet=TRUE)
       names(lakeTypes)[which(names(lakeTypes)=="LINKID")] <- "link"
       rl.full <- plyr::join(rl.full, lakeTypes, by="link")
       lakeOutlets <- subset(rl.full, rl.full$NHDWaterbodyComID > 0 & rl.full$TYPEL==1)
       rm(rl.full)
    
       routlinkInfo <- as.data.table(GetNcdfFile(fullRtlinkFile,c('gages','link','order'), q=TRUE))
       routlinkInfo$ind <- 1:nrow(routlinkInfo)
       gather <- function(gageIdInd) {
         upBranches <- rwrfhydro:::GatherStreamInds(from, start = gageIdInd$gageInd, linkLength=reInd$length)
         indsAll <- c(upBranches$ind, upBranches$startInd)
         upComIds <- routlinkInfo[ind %in% indsAll, link]
       }
    
       lakeIds <- unique(rll$NHDWaterbodyComID)
       lakesToRemove <- c()
       for (lake in lakeIds) {
          lakecom <- subset(lakeOutlets$link, lakeOutlets$NHDWaterbodyComID == lake)
          if (length(lakecom)>0) {
            message(paste0("Processing lake ", lake, " outlet ", lakecom))
    
            # Taken from Arezoo's tracing code. Overkill here, but it works!
            # Extract those ComIds and relvalnt information form the Routlink file to perform the subsetting for them
            routlinkInfoSub <- routlinkInfo[link == lakecom]
            # Find all the COMIDs above the specified comIds
            gageInds <- routlinkInfoSub$ind
            names(gageInds) <- routlinkInfoSub$link
            # make this a list of pairs: gageId, gageInd
            dumList <- 1:length(gageInds)
            names(dumList) <- trimws(names(gageInds))
            gageIndsList <- plyr::llply(dumList, function(ii) list(gageId=names(gageInds)[ii],
                                                           gageInd=gageInds[[ii]]))
            # Trace up
            upComIdsAll <- plyr::llply(gageIndsList, gather, .parallel = FALSE)
            rm(lakecom, routlinkInfoSub, gageInds, dumList, gageIndsList)
    
            # Check if all upstream reaches are in route link
            if (!all(unlist(upComIdsAll) %in% rl$link)) lakesToRemove <- c(lakesToRemove, lake)
          } else {
            message(paste0("No outlet found for ", lake, "so skipping"))
          }
       }
    
       # Adjust lakeparm and routelink
       lkl <- subset(lkl, !(lkl$lake_id %in% lakesToRemove))
       rl[rl$NHDWaterbodyComID %in% lakesToRemove, "NHDWaterbodyComID"] <- -9999
       UpdateLinkFile(subRtlinkFile, rl, subDim=FALSE)
       if (nrow(lkl) != 0) {
          if ("ascendingIndex" %in% names(lkl)) lkl$ascendingIndex <- (rank(lkl$ascendingIndex) - 1)
          file.copy(fullLakeparmFile, subLakeparmFile, overwrite = TRUE)
          UpdateLakeFile(subLakeparmFile, lkl, subDim=TRUE)
       }
    }
    
    
    # Nudging PARAMETER FILE, not tested yet
    
    if (!is.null(fullNudgeParamFile)) {
       print("Processing Nudging Parameters")
    
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
    coordsExport <- data.frame(grid=c("hyd_sn", "hyd_ns", "geo_sn", "geo_ns"),
                                imin=c(hyd_w, hyd_w, geo_w, geo_w),
                                imax=c(hyd_e, hyd_e, geo_e, geo_e),
                                jmin=c(hyd_s, hyd_min, geo_s, geo_min),
                                jmax=c(hyd_n, hyd_max, geo_n, geo_max),
                                index_start=c(1,1,1,1))
    write.table(coordsExport, file=subCoordParamFile, row.names=FALSE, sep="\t")
    
    # Save the forcing subset script file
    #ncksCmd <- paste0("ncks -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ${OLDFORCPATH}/${i} ${NEWFORCPATH}/${i}")
    ncksCmd <- paste0("ncks -d west_east,", geo_w-1, ",", geo_e-1, " -d south_north,", geo_s-1, ",", geo_n-1, " ${OLDFORCPATH}/${i} ${NEWFORCPATH}/${i##*/}")
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
    
    ncksCmd <- paste0("ncks -O -d x,", geo_w-1, ",", geo_e-1, " -d y,", geo_s-1, ",", geo_n-1, " ${OLDFORCPATH}/${i} ${NEWFORCPATH}/${i##*/}")
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
    
    return(myPath)
}

# this is the "main" function that allows this script to be
# called using Rscript with arguments.
if (identical (environment (), globalenv ())) {
    args = commandArgs(trailingOnly=TRUE)
    coords <- as.numeric(args[c(2,3,4,5)])


    if (length(args) == 7) {
        # invoke the subsetting function
        res = suppressWarnings(subsetBbox( args[1], coords[1], coords[2], coords[3], coords[4], args[6], args[7]))
        print(res)
    } else {
        print('Incorrect number of arguments')
    }


}


