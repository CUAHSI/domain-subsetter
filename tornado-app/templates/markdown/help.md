
#### HELP

---

This page offers additional resources that users may find helpful when using the CUAHSI Domain Subsetter for both NWM/WRF-Hydro and ParFlow-CONUS. 

---

#### National Water Model 

- Office of Water Prediction (OWP), National Water Model  
<http://water.noaa.gov>

- OWP National Water Model Mapping Interface _(this is particularly useful to check COMIDs)_  
<http://water.noaa.gov/map>

- HydroShare National Water Model Viewer for data collection  
<https://hs-apps.hydroshare.org/apps/nwm-forecasts/>

###### General Resources

It should be noted that we do not fully outline how to set up a WRF-Hydro model here and this page intended to give only general advice on the build process in reference to using WRF-Hydro with the CUAHSI NWM subsetting tool. WRF-Hydro is extensively documented by the development team at NCAR and you should refer to the [WRF-Hydro Modeling System website](<https://ral.ucar.edu/projects/wrf_hydro/overview>) and the links below for general WRF-Hydro information. For additional [user support](<https://ral.ucar.edu/projects/wrf_hydro/contact>), please contact <wrfhydro@ucar.edu>.

- WRF-Hydro V5 Technical Description:  
<https://ral.ucar.edu/sites/default/files/public/WRF-HydroV5TechnicalDescription_0.pdf>

- WRF-Hydro and NWM Source Code:  
<https://github.com/NCAR/wrf_hydro_nwm_public/tags>

- WRF-Hydro Citation and User Guides:  
<https://ral.ucar.edu/projects/wrf_hydro/technical-description-user-guide>

- Training Materials:  
<https://ral.ucar.edu/projects/wrf_hydro/training-materials>

- The Croton, NY testcase is a good reference for how to compile and run WRF-Hydro:  
<https://ral.ucar.edu/projects/wrf_hydro/testcases>  

- _rwrfhydro_, an R toolbox for managing, analyzing, and visualizing WRF-Hydro data:  
<https://github.com/NCAR/rwrfhydro>  
National Water Model NetCDF domain files and outputs can be easily accessed using the  _rwrfhydro_ package developed at NCAR. 

- Meteorological Forcing Regridding scripts for regridding forcing to the WRF-Hydro geogrid:  
<https://ral.ucar.edu/projects/wrf_hydro/regridding-scripts>


###### Basic Model Set-Up (i.e. How to use your subsetted domain):

1. Reference the following documents:  
	- “How to Build and Run WRF-Hydro V5 in Standalone Mode”:  
<https://ral.ucar.edu/sites/default/files/public/HowToBuildandRunWRF-HydroV5inStandaloneMode_0.pdf>
	- “WRF-Hydro V5 Test Case User Guide”:  
<https://ral.ucar.edu/sites/default/files/public/WRF-HydroV5TestCaseUserGuide_4.pdf>

2. Obtain the [source code](<https://github.com/NCAR/wrf_hydro_nwm_public/tags>) for the latest WRF-Hydro release

3. Set the required environmental variables for your machine/environment.

4. Configure 

5. Compile with nudging turned off  

The CUAHSI Domain Subsetting Tool: NWM v1.2 does not currently support subsetting of Nudging files.  As such, the model must be compiled using the NoahMP land surface model (LSM) with NUDGING TURNED OFF in the ```setEnvar.sh``` script (```export WRF_HYDRO_NUDGING=0```). 

---

##### ParFlow


###### General Resources

_ParFlow CONUS:_

- Maxwell, R. M., Condon, L. E., & Kollet, S. J. (2015). [A high-resolution simulation of groundwater and surface water over most of the continental US with the integrated hydrologic model ParFlow v3.](<https://www.geosci-model-dev.net/8/923/2015/>) Geoscientific Model Development, 8, 923–937. doi:10.5194/gmd-8-923-2015.  
- Maxwell, R. M., & Condon, L. (2016). [Connections between groundwater flow and transpiration partitioning.](<https://science.sciencemag.org/content/353/6297/377>) Science, 353(6297), 377–379. doi:10.1126/science.aaf7891.

_ParFlow:_

- Jones, J.E. and Woodward, C.S. (2001). [Newton–Krylov-multigrid solvers for large-scale, highly heterogeneous, variably saturated flow problems.] (<http://www.sciencedirect.com/science/article/pii/S0309170800000750>) Advances in Water Resources, 24(7), 763–774, doi:10.1016/S0309-1708(00)00075-0.  
- Ashby S.F. and Falgout, R.D. (1996). [A Parallel Multigrid Preconditioned Conjugate Gradient Algorithm for Groundwater Flow Simulations.](<http://www.ans.org/pubs/journals/nse/a_24230>) Nuclear Science and Engineering, 124(1), 145-159.  
- Kollet, S.J. and Maxwell, R.M. (2006). [Integrated surface-groundwater flow modeling: a free-surface overland flow boundary condition in a parallel groundwater flow model.](<https://www.sciencedirect.com/science/article/abs/pii/S0309170805002101>) Advances in Water Resources, 29(7), 945-958, doi:10.1016/j.advwatres.2005.08.006.  
- Maxwell, R.M. (2013) [A terrain-following grid transform and preconditioner for parallel, large-scale, integrated hydrologic modeling.](<https://www.sciencedirect.com/science/article/abs/pii/S0309170812002564>) Advances in Water Resources, 53, 109-117, doi:10.1016/j.advwatres.2012.10.001.  

_ParFlow coupled to CLM_

- Maxwell, R.M. and Miller, N.L. (2005). [Development of a Coupled Land Surface and Groundwater Model.](<https://journals.ametsoc.org/doi/full/10.1175/JHM422.1>) Journal of Hydrometeorology, 6(3), 233-247, doi:10.1175/JHM422.1.  
- Kollet, S.J. and Maxwell, R.M. (2008). [Capturing the influence of groundwater dynamics on land surface processes using an integrated, distributed watershed model.](<https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2007WR006004>) Water Resources Research, 44(2), W02402, doi:10.1029/2007WR006004

##### Code Download

ParFlow is available on GitHub <https://github.com/parflow/parflow>, including the newest and older versions. At the time of writing this documentation, the latest stable release is [v3.6.0 (2019-09-01)](<https://github.com/parflow/parflow/releases/tag/v3.6.0>), which also contains many test cases including data to get started.

##### Running ParFlow
- ParFlow website includes extensive ParFlow resources on documentation, example applications, publications and user manual, and source code download.
<https://parflow.org>

- ParFlow blog, for troubleshooting and installation instructions. <http://parflow.blogspot.com>

- ParFlow mailing list <https://mailman.mines.edu/mailman/listinfo/parflow-users>

- ParFlow is available as a Docker container. Instructions can be found on the Docker page on the ParFlow GitHub <https://github.com/parflow/docker>.


##### Visualization
Both _VisIt_ <https://wci.llnl.gov/simulation/computer-codes/visit/executables> and _ParaView_ <https://www.paraview.org/download/>  support visualization of ParFlow output files 

---

#### ADDITIONAL RESOURCES 

##### NLDAS-2 Meteorological Forcing  
The North American Land Data Assimilation System is a quality-controlled, spatially and temporally consistent meteorological dataset with many uses. It is one product that can be used to force subsetted NWM and PF-CONUS domains, after it has been regridded to the model domain. For NWM, [regridding tools] (<https://ral.ucar.edu/projects/wrf_hydro/regridding-scripts>) are available on the WRF-Hydro website. <http://ldas.gsfc.nasa.gov/nldas/>  

##### Hydrologic Unit Code (HUC)
Find HUC of interest using the USGS _Science in Your Watershed_ website <https://water.usgs.gov/wsc/map_index.html>

##### NHDPlus High Resolution 
The NHDPlus catchments and vector stream network are used directly in the NWM, as well as to inform development of a new PF-CONUS domain that extends to the coastlines (still to be released). <https://www.usgs.gov/core-science-systems/ngp/national-hydrography/nhdplus-high-resolution>

---

#### CONTACT & INQUIRES 

***CUAHSI Subsetting Tool questions***    
Contact Tony Castronova <acastronova@cuahsi.org> or Danielle Tijerina <dtijerina@mines.edu>

***WRF-Hydro specific questions***   
Visit the [WRF-Hydro Support Page](https://ral.ucar.edu/projects/wrf_hydro/contact) and contact <nws.nwc.ops@noaa.gov> for questions specifically about the National Water Model.

***ParFlow specific questions***  
Consult the [ParFlow blog](<http://parflow.blogspot.com/>), [ParFlow user's manual] (<https://github.com/parflow/parflow/blob/v3.6.0/parflow-manual.pdf>), or report problems to the [mailing list](<https://mailman.mines.edu/mailman/listinfo/parflow-users>) or [ParFlow Github issue tracker.](<https://github.com/parflow/parflow/issues>)


