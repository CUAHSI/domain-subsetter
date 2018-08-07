# nwm_subsetting

This project consists of a set of experimental tools for subsetting National Water Model domain input files.




## Data Collection

Catchment data can be collected for CONUS at HUC-12 scale from the NHDPlus Version 1.2:

http://www.horizon-systems.com/NHDPlusData/NHDPlusV21/Data/NationalData/NHDPlusV21_NationalData_WBDSnapshot_Shapefile_08.7z

## Data Preparation

Bounding boxes are computed for each HUC-12 catchement in the CONUS using the `bbox.py` library. These bounding boxes are validated using the `test_bbox.py` script which creates shapefiles that can be manually inspected for accuracy and consistency.



