#******************************************  Script description  ****************************************************************************
#
# This script is being modified to minimize the manual work required for the massive subsetting (for the second round of calibration)
# The only input required is either the list of comIDs, or the list of gagesID, 
# If the gage does not exists in the Routlink file, it just throws a warning and continue with the subsetting the gauges which exists in the Routlink file
#
#*********************************************************************************************************************************************

#------------------------------------------ INPUTS : Please change the following parts as instructed ------------------------------------------

#******  Specify the details for your subsetting job *****************

# A charcter vector : list of the comIDs to be used for subsetting. If gages is defined comIds should be NULL.
comIds <- NULL

# A character vector : list of the gauges to be used for subsetting. If comIds is specified, gages should be NULL.
gageIds <- c("02372250", "07292500", "02296500", "02202600", "06464500")

load('/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/OBS/obsStrData_GAGESIIREF_NWMV11_2010_2016_DV_DT_SCREENED.Rdata')
#gageIds <- subset(obsStrMeta, RFC == "NCRFC")$site_no
gageIds <- "06221400"

# This is for the extra California gauges
#load("/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/OBS/obsStrData_CADWR_NWMV11_2008_2016_DV_DT_SCREENED.Rdata")
#gageIds <- subset(obsStrMeta)$site_no

#******  Specify the ORIGINAL (full extent) domain files *****************

# Routing domain file
#fullHydFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/Fulldom_hires_netcdf_file_250m_NWMv1.1_calib2_newdem.nc" This is been replaced with the new file from Aubrey with Kevin edits 2/17/2017
#fullHydFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/Fulldom_hires_netcdf_file_250m_NWMv1.2_harmdem.nc"
fullHydFile <- "/glade/u/home/adugger/P_NWMV12/CONUS_CALIB/DOMAIN/Fulldom_hires_netcdf_file_250m_NWMv1.2_harmdem_DEFPARAMS.nc"
# Geogrid domain file
fullGeoFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/geo_em.d01.nc.conus_1km_nlcd11_glacfix"

# Wrfinput domain file
fullWrfFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/wrfinput_d01_1km_nlcd11_glacfix_soilwatfix"

# Route link file
# This file should be the original Route Link file with an additional "index" variable which lists the link index position. This is used for upstream tracing
# and allows us to subset from pre-subsetted domains(!). 
fullRtlinkFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS_INDEXED.nc"
#fullRtlinkFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS_INDEXED_CAGAGES.nc"
# Spatial weights file
fullSpwtFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/spatialweights_250m_v1_1_all_basins_20161104_.nc"

# GW bucket parameter file
#fullGwbuckFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/GWBUCKPARM_NWM_v1_1_20161104_sorted_NEWPARAMS.nc"
fullGwbuckFile <- "/glade/u/home/adugger/P_NWMV12/CONUS_CALIB/DOMAIN/GWBUCKPARM_NWM_v1_1_20161104_sorted_NEWPARAMS_DEFPARAMS.nc"

# Soil parameter file
#fullSoilparmFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/soil_veg_properties_NWMv1.1_calib3_DIMFIX.nc"
fullSoilparmFile <- "/glade/u/home/adugger/P_NWMV12/CONUS_CALIB/DOMAIN/soil_properties_DEFPARAMS.nc"

# Lake parameter file
fullLakeparmFile <- "/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/DOMAIN/LAKEPARM_ks_scaled_max_el_Feb_12_2016_1d_WeirC_OrificeC_min_alt_1.0_WeirL_35.0_RELABEL_goodlakes1260.nc"

# Route Link index files. These should be consistent with the Route Link file above.
downstreamReExpFile <- "/glade/u/home/jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1.1/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS.reExpTo.Rdb"
upstreamReExpFile   <- "/glade/u/home/jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1.1/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS.reExpFrom.Rdb"
reIndFile       <- "/glade/u/home/jamesmcc/WRF_Hydro/TESTING/TEST_FILES/CONUS/V1.1/RouteLink_2016_11_04_fixed_latlonalt_gagefix_topofix_NEWPARAMS.reInd.Rdb"

#******  Specify additional domain and job info  *****************

# Multiplier between routing grid and LSM grid
# (e.g., 1-km LSM and 250-m routing means a value of 4)
dxy <- 4

# Forcing directory if auto-subsetting forcing files, otherwise NULL
fullForcDir <- '/glade/scratch/zhangyx/WRF-Hydro/ForcingData.symlinks/2007-2016/'

# Observation file
obsFile <- '/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/OBS/obsStrData_GAGESIIREF_NWMV11_2010_2016_DV_DT_SCREENED.Rdata'
#obsFile <- '/glade/p/nwc/adugger/NWM_V12/CONUS_CALIB/OBS/obsStrData_CADWR_NWMV11_2008_2016_DV_DT_SCREENED.Rdata'

