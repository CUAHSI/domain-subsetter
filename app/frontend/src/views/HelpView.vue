<template>
  <h2 class="ma-2 text-center">Help</h2>
  <v-container>
    <v-expansion-panels variant="inset" class="my-4">
      <v-expansion-panel>
        <v-expansion-panel-title><h3>National Water Model</h3></v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list>
            <v-list-item>
              <p>Office of Water Prediction (OWP), National Water Model<br /><a
                  href="http://water.noaa.gov">http://water.noaa.gov</a></p>
            </v-list-item>
            <v-list-item>
              <p>OWP National Water Model Mapping Interface <em>(this is particularly useful to check COMIDs)</em><br /><a
                  href="http://water.noaa.gov/map">http://water.noaa.gov/map</a></p>
            </v-list-item>
            <v-list-item>
              <p>HydroShare National Water Model Viewer for data collection<br /><a
                  href="https://hs-apps.hydroshare.org/apps/nwm-forecasts/">https://hs-apps.hydroshare.org/apps/nwm-forecasts/</a>
              </p>
            </v-list-item>
          </v-list>
          <h4>General Resources</h4>
          <p>It should be noted that we do not fully outline how to set up a WRF-Hydro model here and this page intended
            to
            give only general advice on the build process in reference to using WRF-Hydro with the CUAHSI NWM subsetting
            tool. WRF-Hydro is extensively documented by the development team at NCAR and you should refer to the <a
              href="https://ral.ucar.edu/projects/wrf_hydro/overview">WRF-Hydro Modeling System website</a> and the links
            below for general WRF-Hydro information. For additional <a
              href="https://ral.ucar.edu/projects/wrf_hydro/contact">user support</a>, please contact <a
              href="mailto:wrfhydro@ucar.edu">wrfhydro@ucar.edu</a></p>

          <v-list>
            <v-list-item>
              <p>WRF-Hydro V5 Technical Description:<br /><a
                  href="https://ral.ucar.edu/sites/default/files/public/WRF-HydroV5TechnicalDescription_0.pdf">https://ral.ucar.edu/sites/default/files/public/WRF-HydroV5TechnicalDescription_0.pdf</a>
              </p>
            </v-list-item>
            <v-list-item>
              <p>WRF-Hydro and NWM Source Code:<br /><a
                  href="https://github.com/NCAR/wrf_hydro_nwm_public/tags">https://github.com/NCAR/wrf_hydro_nwm_public/tags</a>
              </p>
            </v-list-item>
            <v-list-item>
              <p>WRF-Hydro Citation and User Guides:<br /><a
                  href="https://ral.ucar.edu/projects/wrf_hydro/technical-description-user-guide">https://ral.ucar.edu/projects/wrf_hydro/technical-description-user-guide</a>
              </p>
            </v-list-item>
            <v-list-item>
              <p>Training Materials:<br /><a
                  href="https://ral.ucar.edu/projects/wrf_hydro/training-materials">https://ral.ucar.edu/projects/wrf_hydro/training-materials</a>
              </p>
            </v-list-item>
            <v-list-item>
              <p>The Croton, NY testcase is a good reference for how to compile and run WRF-Hydro:<br /><a
                  href="https://ral.ucar.edu/projects/wrf_hydro/testcases">https://ral.ucar.edu/projects/wrf_hydro/testcases</a>
              </p>
            </v-list-item>
            <v-list-item>
              <p><em>rwrfhydro</em>, an R toolbox for managing, analyzing, and visualizing WRF-Hydro data:<br /><a
                  href="https://github.com/NCAR/rwrfhydro">https://github.com/NCAR/rwrfhydro</a><br />National Water Model
                NetCDF domain files and outputs can be easily accessed using the <em>rwrfhydro</em> package developed at
                NCAR.</p>
            </v-list-item>
            <v-list-item>
              <p>Meteorological Forcing Regridding scripts for regridding forcing to the WRF-Hydro geogrid:<br /><a
                  href="https://ral.ucar.edu/projects/wrf_hydro/regridding-scripts">https://ral.ucar.edu/projects/wrf_hydro/regridding-scripts</a>
              </p>
            </v-list-item>
          </v-list>
          <h4>Basic Model Set-Up (i.e. How to use your
            subsetted domain):</h4>
          <ol style="list-style-type: decimal">
            <v-list-item>Reference the following documents:
              <v-list>
                <v-list-item>“How to Build and Run WRF-Hydro V5 in Standalone Mode”:<br /><a
                    href="https://ral.ucar.edu/sites/default/files/public/HowToBuildandRunWRF-HydroV5inStandaloneMode_0.pdf">https://ral.ucar.edu/sites/default/files/public/HowToBuildandRunWRF-HydroV5inStandaloneMode_0.pdf</a>
                </v-list-item>
                <v-list-item>“WRF-Hydro V5 Test Case User Guide”:<br /><a
                    href="https://ral.ucar.edu/sites/default/files/public/WRF-HydroV5TestCaseUserGuide_4.pdf">https://ral.ucar.edu/sites/default/files/public/WRF-HydroV5TestCaseUserGuide_4.pdf</a>
                </v-list-item>
              </v-list>
            </v-list-item>
            <v-list-item>
              <p>Obtain the <a href="https://github.com/NCAR/wrf_hydro_nwm_public/tags">source code</a> for the latest
                WRF-Hydro release</p>
            </v-list-item>
            <v-list-item>
              <p>Set the required environmental variables for your machine/environment.</p>
            </v-list-item>
            <v-list-item>
              <p>Configure</p>
            </v-list-item>
            <v-list-item>
              <p>Compile with nudging turned off</p>
            </v-list-item>
          </ol>
          <p>The CUAHSI Domain Subsetting Tool: NWM v1.2 does not currently support subsetting of Nudging files. As such,
            the model must be compiled using the NoahMP land surface model (LSM) with NUDGING TURNED OFF in the
            <code>setEnvar.sh</code> script (<code>export WRF_HYDRO_NUDGING=0</code>).
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title><h3>ParFlow</h3></v-expansion-panel-title>
        <v-expansion-panel-text>
          <h4 id="general-resources-1">General Resources</h4>
          <p><em>ParFlow CONUS:</em></p>
          <v-list>
            <v-list-item>Maxwell, R. M., Condon, L. E., &amp; Kollet, S. J. (2015). <a
                href="https://www.geosci-model-dev.net/8/923/2015/">A high-resolution simulation of groundwater and
                surface
                water over most of the continental US with the integrated hydrologic model ParFlow v3.</a> Geoscientific
              Model Development, 8, 923–937. doi:10.5194/gmd-8-923-2015.<br /></v-list-item>
            <v-list-item>Maxwell, R. M., &amp; Condon, L. (2016). <a
                href="https://science.sciencemag.org/content/353/6297/377">Connections between groundwater flow and
                transpiration partitioning.</a> Science, 353(6297), 377–379. doi:10.1126/science.aaf7891.</v-list-item>
          </v-list>
          <p><em>ParFlow:</em></p>
          <v-list>
            <v-list-item>Jones, J.E. and Woodward, C.S. (2001). [Newton–Krylov-multigrid solvers for large-scale, highly
              heterogeneous, variably saturated flow problems.] (<a
                href="http://www.sciencedirect.com/science/article/pii/S0309170800000750">http://www.sciencedirect.com/science/article/pii/S0309170800000750</a>)
              Advances in Water Resources, 24(7), 763–774, doi:10.1016/S0309-1708(00)00075-0.<br /></v-list-item>
            <v-list-item>Ashby S.F. and Falgout, R.D. (1996). <a href="http://www.ans.org/pubs/journals/nse/a_24230">A
                Parallel
                Multigrid Preconditioned Conjugate Gradient Algorithm for Groundwater Flow Simulations.</a> Nuclear
              Science
              and Engineering, 124(1), 145-159.<br /></v-list-item>
            <v-list-item>Kollet, S.J. and Maxwell, R.M. (2006). <a
                href="https://www.sciencedirect.com/science/article/abs/pii/S0309170805002101">Integrated
                surface-groundwater flow modeling: a free-surface overland flow boundary condition in a parallel
                groundwater
                flow model.</a> Advances in Water Resources, 29(7), 945-958,
              doi:10.1016/j.advwatres.2005.08.006.<br /></v-list-item>
            <v-list-item>Maxwell, R.M. (2013) <a
                href="https://www.sciencedirect.com/science/article/abs/pii/S0309170812002564">A
                terrain-following grid transform and preconditioner for parallel, large-scale, integrated hydrologic
                modeling.</a> Advances in Water Resources, 53, 109-117, doi:10.1016/j.advwatres.2012.10.001.</v-list-item>
          </v-list>
          <p><em>ParFlow coupled to CLM</em></p>
          <v-list>
            <v-list-item>Maxwell, R.M. and Miller, N.L. (2005). <a
                href="https://journals.ametsoc.org/doi/full/10.1175/JHM422.1">Development of a Coupled Land Surface and
                Groundwater Model.</a> Journal of Hydrometeorology, 6(3), 233-247,
              doi:10.1175/JHM422.1.<br /></v-list-item>
            <v-list-item>Kollet, S.J. and Maxwell, R.M. (2008). <a
                href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2007WR006004">Capturing the influence of
                groundwater dynamics on land surface processes using an integrated, distributed watershed model.</a> Water
              Resources Research, 44(2), W02402, doi:10.1029/2007WR006004</v-list-item>
          </v-list>
          <h4 id="code-download">Code Download</h4>
          <p>ParFlow is available on GitHub <a
              href="https://github.com/parflow/parflow">https://github.com/parflow/parflow</a>, including the newest and
            older versions. At the time of writing this documentation, the latest stable release is <a
              href="https://github.com/parflow/parflow/releases/tag/v3.6.0">v3.6.0 (2019-09-01)</a>, which also contains
            many test cases including data to get started.</p>
          <h5 id="running-parflow">Running ParFlow</h5>
          <v-list>
            <v-list-item>
              <p>ParFlow website includes extensive ParFlow resources on documentation, example applications, publications
                and user manual, and source code download. <a href="https://parflow.org">https://parflow.org</a></p>
            </v-list-item>
            <v-list-item>
              <p>ParFlow blog, for troubleshooting and installation instructions. <a
                  href="http://parflow.blogspot.com">http://parflow.blogspot.com</a></p>
            </v-list-item>
            <v-list-item>
              <p>ParFlow mailing list <a
                  href="https://mailman.mines.edu/mailman/listinfo/parflow-users">https://mailman.mines.edu/mailman/listinfo/parflow-users</a>
              </p>
            </v-list-item>
            <v-list-item>
              <p>ParFlow is available as a Docker container. Instructions can be found on the Docker page on the ParFlow
                GitHub <a href="https://github.com/parflow/docker">https://github.com/parflow/docker</a>.</p>
            </v-list-item>
          </v-list>
          <h4 id="visualization">Visualization</h4>
          <p>Both <em>VisIt</em> <a
              href="https://wci.llnl.gov/simulation/computer-codes/visit/executables">https://wci.llnl.gov/simulation/computer-codes/visit/executables</a>
            and <em>ParaView</em> <a href="https://www.paraview.org/download/">https://www.paraview.org/download/</a>
            support visualization of ParFlow output files </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title><h3>Additional Resources</h3></v-expansion-panel-title>
        <v-expansion-panel-text>
          <h4>NLDAS-2 Meteorological Forcing</h4>
          <p>The North American Land Data Assimilation System is a quality-controlled, spatially and temporally consistent
            meteorological dataset with many uses. It is one product that can be used to force subsetted NWM and PF-CONUS
            domains, after it has been regridded to the model domain. For NWM, [regridding tools] (<a
              href="https://ral.ucar.edu/projects/wrf_hydro/regridding-scripts">https://ral.ucar.edu/projects/wrf_hydro/regridding-scripts</a>)
            are available on the WRF-Hydro website. <a
              href="http://ldas.gsfc.nasa.gov/nldas/">http://ldas.gsfc.nasa.gov/nldas/</a></p>
          <h4>Hydrologic Unit Code (HUC)</h4>
          <p>Find HUC of interest using the USGS <em>Science in Your Watershed</em> website <a
              href="https://water.usgs.gov/wsc/map_index.html">https://water.usgs.gov/wsc/map_index.html</a></p>
          <h4>NHDPlus High Resolution</h4>
          <p>The NHDPlus catchments and vector stream network are used directly in the NWM, as well as to inform
            development
            of a new PF-CONUS domain that extends to the coastlines (still to be released). <a
              href="https://www.usgs.gov/core-science-systems/ngp/national-hydrography/nhdplus-high-resolution">https://www.usgs.gov/core-science-systems/ngp/national-hydrography/nhdplus-high-resolution</a>
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title><h3>Contact</h3></v-expansion-panel-title>
        <v-expansion-panel-text>
          <p><strong><em>CUAHSI Subsetting Tool questions</em></strong><br />Contact Tony Castronova</p>
          <p><strong><em>WRF-Hydro specific questions</em></strong><br />Visit the <a
              href="https://ral.ucar.edu/projects/wrf_hydro/contact">WRF-Hydro Support Page</a> and contact </p>
          <p><strong><em>ParFlow specific questions</em></strong><br />Consult the <a
              href="http://parflow.blogspot.com/">ParFlow blog</a>, [ParFlow user's manual] (<a
              href="https://github.com/parflow/parflow/blob/v3.6.0/parflow-manual.pdf">https://github.com/parflow/parflow/blob/v3.6.0/parflow-manual.pdf</a>),
            or report problems to the <a href="https://mailman.mines.edu/mailman/listinfo/parflow-users">mailing list</a>
            or
            <a href="https://github.com/parflow/parflow/issues">ParFlow Github issue tracker.</a>
          </p>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</v-container></template>
