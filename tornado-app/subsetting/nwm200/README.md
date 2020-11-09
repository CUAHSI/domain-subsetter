i# wrf_hydro_subsetting
In time the subsetting scripts have evolved and the purpose of this repository is to keep all versions in one place. The following versions are in chronological order.
* [Subset using the coordinates](#subset-using-the-coordinates)

* [Subset using tracing upstream reaches](#subset-using-tracing-upstream-reaches)

* [Subset using tracing upstream reaches (Calibration V1.2)](#subset-using-tracing-upstream-reaches-calibration-v12)

# [Subset using the coordinates](./subset_w_coordinates)
This was the first attempt to subset the domain done by Aubrey Dugger. The directory has only two main scripts. 
* [Utils_ReachFiles.R](./subset_w_coordinates/Utils_ReachFiles.R), this script has all the functions required by [subset_domain.R](./subset_w_coordinates/subset_domain.R), user does not need to edit this file. 
* [subset_domain.R](./subset_w_coordinates/subset_domain.R) is the main script that requires editting to serve the user's purpose. 

## Requirements:
R (rwrfhydro, ncdf4, sp, raster, stringr, plyr libraries)

NCO (ncks, and ncatted commands are used)

## Procedure:
The user provides x and y coordinates from the GEOGRID file projection system, which is currently the Lambert Conformal Conic. Then, the relative indices (west, east, south, north) in the original GEOGIRD and Fulldom file will be calculated. These indices are directly used in clipping the GEOGRID, Wrfinput, and Fulldom files.

Then all the links and catchments which fall in the rectangle domain (clip) are identified and will be used in subsetting the Routelink, spatial weight, groundwater bucket and Soil parameter files and any other input files provided by the user. 

All the indices used in subsetting are written into a text file named by default "params.txt". The user can change the name of this file if they choose to.

Finally, a script will be prepared for the FORCING subsetting. It is designed to work with NLDAS (LDASIN) FORCING files, but will require editing to work for other FORCING data files. 

## how to run
Provide the following:
* The path to your NEW subset domain file directory
* The bounding coordinates for clipping the files
* The Projection of the coordinates, it needs to be a PROJ4 string (for example, "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs")
* The Multiplier between routing grid and LSM grid
* Number of cells to buffer (default 2)
* Path to the ORIGINAL (full extent) domain files (Fulldom, GEOGRID, Wrfinput, RouteLink, spatial weights, groundwater bucket parameter, lake parameter, soil parameter files, etc. If you do not wish to subset any file leave it as NULL, GEOGRID file is requied at all times.)

Command to run --> Rscript subset_domain.R

# [Subset using tracing upstream reaches](./subset_w_tracing)

The subsetting with coordinates, requires reading the coordinates for the corners of the rectangle including the basin in mind. To automate the subsetting process, we decided to provide the output location (reach which all the basin drains to it) and trace all the upstream reaches and then subset provided all the upstream reaches and basins are in the clipped domain. Keep in mind any reach has a corresponding catchment. This directory has also two main scripts. 
* [Utils_ReachFiles.R](./subset_w_tracing/Utils_ReachFiles.R), this script has all the functions required by [subset_domain_REACHRT_tracing_with_modified_routlink.R](./subset_w_tracing/subset_domain_REACHRT.R), user does not need to edit this file. 
* [subset_domain_REACHRT_tracing_with_modified_routlink.R](./subset_w_coordinates/subset_domain_REACHRT_tracing_with_modified_routlink.R) is the main script that requires editting. 

## Procedure:
The user provides the list of gageIds/comIds. If the gageId/comId does not exist in the Routlink file, it will give a warning and continue with the ones that exist in the Routlink file. Indicies will be derived using three indexing files which collect all upstream links and a patial weight file containing the i,j vales for each ComID. The three indexing files are unique to the original domain files and if there is a change to the original domain these files should be reproduced. (These indexing files were created by James McCreight.) After the indices are derived, the rest of the procdure will be similar to [Subset using the coordinates](#subset-using-the-coordinates). This script will need to be run for each unique basin subset.

Notice in this version, lake parameter file is not clipped and will be only copied. 

All the indices used in the subsetting are written into a default text file named "params.txt". The user can change the naming of this file.

Finally, a script will be prepared for the FORCING subsetting. It is designed to work with NLDAS (LDASIN) FORCING data files, but will require editing to work for other FORCING data files.

## how to create the tracing files:
Requirements:
```{R}
library(rwrfhydro)
path <- "~"
routlinkFile <- "RouteLink_2017_04_24.nc"
filePath <- paste0(path, "/", routlinkFile)
ReExpressRouteLink(filePath, parallel = TRUE)
```
This will create three files written in the defined path, where the Routlink file resides. Note: This can be a time consuming process. For the CONUS this needs 32 cores, with 12 hour wall clock approximately. 

## how to run
The user is required to provide the following:
* The path to your NEW subset domain file directory
* List of gageIds of comIds, it will create one clipped basin for each gageId/comId
* Number of cells to buffer (default 2)
* Path to the ORIGINAL (full extent) domain files (for Fulldom, GEOGRID, Wrfinput, Routelink, spatial weight, groundwater bucket parameter, lake parameter and soil parameter files)
* Path to the indexing file (downstreamReExpFile, upstreamReExpFile and reIndFile)
* Number of cores for parallelization

Command to run --> script subset_domain_REACHRT_tracing_with_modified_routlink.R

# [Subset using tracing upstream reaches (Calibration V1.2)](./subset_w_tracing_calib_V1.2)

This is a modified version of [Subset using tracing upstream reaches](#subset-using-tracing-upstream-reaches) to minimize the manual work required for creating multiple subsets(for the second round of calibration V1.2). The main difference between the two is that this version will submit the jobs for the FORCING subsetting also, while for former, the user needs to modify the script and run it for each basin (not efficient). The main input required is the list of gagesID. In the case of using gageIds, if the gage does not exist in the Routelink file, it gives a warning and continues with the ones that exist in the Routelink file. The required inputs are specified in the namelist_SubsetDomainReachRt.R script. It will create a directory as the user has defined, and then create one directory per gageId named gageId, and place all the subsetted domain files there (plus a FORCING directory).

## Procedure
There are 4 Rscripts and 2 bash scripts for the subsetting procedure. A brief explanation of all scripts is given below. The namelist_SubsetDomainReachRt.R is the script requiring changes and editions to serve your purpose, the rest of the scripts do not need editing.

### Utils_ReachFiles.R
This script contains all the functions called in other scripts. One does not need to touch this part of the script, unless there are fundamental changes to the domain files. 

### namelist_SubsetDomainReachRt.R
All the required inputs are specified in this file. 
1. A vector of comIDs/gageIDs to be used as the outlet of the domains.
2. The path to all the domain files that are going to be subsetted (Fuldom, GEOGRID , wrfinput, spatial weight, Ground bucket, soil parameter, lake parameter files).
3. Path to the index files generated by James McCreight, required for tracing all the links above the outlet location. 
4. Path to forcing files
5. R data set for all the streamflow observations. 

### config_SubsetDomainReachRt.R
This script sources the Utils_ReachFiles.R and namelist_SubsetDomainReachRt.R. For each gage it traces all the links draining to the outlet location (gage location) and finds the corner indices for the subsetting. It saves all the relevant information such as west, east, north and south indices for the geodomian file and Fuldom file into "infoDT.csv" and "infoDT.Rdata" for the user to review if required, and it will be used in the runsub_SubsetDomainReachRt.R script.

### runsub_SubsetDomainReachRt.R
This script sources the Utils_ReachFiles.R and namelist_SubsetDomainReachRt.R. It gets the name of the gage(s) and the destination path. It does the actual subsetting, and writes the subsetted files into the detination path. 

### SubsetDomainReachRt.sh
The main script calling all the scripts to perform the subsetting for all the Domain files and submitting the forcing data subsetting at the user's request.

### SubsetForcing.sh
Subsets the forcing data. 

## How to run it
If you want to do the subsetting on the domain files, but have no intent to subset the forcing 
SubsetDomainReachRt.sh /Path/To/Where/To/Place/Subsetted/Domain forcoff submitOn

If you want to subset the domain and focing at the same time
SubsetDomainReachRt.sh /Path/To/Where/To/Place/Subsetted/Domain forcOn submitOn
