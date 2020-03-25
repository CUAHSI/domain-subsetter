import os

# Server settings
address = "0.0.0.0"
port = "80"

debug = True
static_path = os.path.join(os.path.dirname(__file__), "static")
template_path = os.path.join(os.path.dirname(__file__), "templates")

# multiprocessing settings
worker_count = 4

# logging settings
log_dir = '/share/appdata/logs'
log_file_size = 1024 * 20 * 1000
log_count = 10

# levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
access_level = 'DEBUG'
application_level = 'DEBUG'
general_level = 'DEBUG'

# WRF-HYDRO settings
wrfdata = '/share/nwm.v1.2.4'
wrf2data = '/share/nwm.v2.0.0'

# Output subset directory
output_dir = '/share/appdata/output'

# Location of jobs database
sqldb = '/share/appdata/jobs.db'

# PARFLOW v1.0 settings
pfexedir = os.path.join(os.path.dirname(__file__), 'pfconus1/Subsetting')
pfdata_v1 = '/share/pfconus.v1.0'
pfmask = f'{pfdata_v1}/conus_1km_PFmask2.tif'
pflakesmask = f'{pfdata_v1}/conus_1km_PFmask_selectLakesmask.tif'
pflakesborder = f'{pfdata_v1}/conus_1km_PFmask_selectLakesborder.tif'
pfbordertype = f'{pfdata_v1}/1km_PF_BorderCellType.tif'
pfsinks = f'{pfdata_v1}/conus_1km_PFmask_manualsinks.tif'
pfslopex = f'{pfdata_v1}/slopex.tif'
pfslopey = f'{pfdata_v1}/slopey.tif'
pfgrid = f'{pfdata_v1}/grid3d.v3.tif'
pfpress = f'{pfdata_v1}/press.in.tif'
gbpl = f'{pfdata_v1}/naigbpl20.tif'
pftemplate = f'{pfdata_v1}/simulation.tcl'
