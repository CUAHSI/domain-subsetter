#Tutorial
##How to use the CUAHSI Subsetter Tool: National Water Model v1.2

1. Open the _Map_ tab
2. Zoom to your area of interest on the map until you can see the catchments outlined in Green (these are HUC12)
3. Use your cursor to select the one or multiple green HUC12 catchments. You will see a box outlining the area that the tool will subset. _*Note: if the box outline is Red, the catchment you have selected is too large to subset_
4. Once you are satisfied with selected area, press the _Submit_ button in the lower right corner below the map.
5. Your catchment is being subsetted! Wait for the tool to process...
6. Download your tar.gz file containing the domain files necessary to run the NWM at the area you selected

######Considerations
- Try to select a headwaters catchment, as the tool does not currently support upstream tracing
- Some other things to consider...

##Other helpful tools
####Reading Domain files and Outputs
National Water Model NetCDF domain files and outputs can be easily accessed using the R package rwrfhydro (<https://ral.ucar.edu/projects/wrf_hydro/rwrfhydro>) developed at NCAR.  
######Some helpful R rwrfhydro tools that can be used with the CUAHSI subsetter...
- Read the ```RouteLink.nc``` file - this is helpful to find the COMID that is associated with your USGS site number  
```myRouteLinkFile <- ReadRouteLink("/mypath/Route_Link.nc")```

