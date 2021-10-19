import os

# Server settings
address = os.environ.get("ADDRESS", "0.0.0.0")
port = os.environ.get("PORT", "443")

# ssl certs
ssl_cert = os.environ.get("SSL_CERT", "ssl/cuahsi.cert")
ssl_key = os.environ.get("SSL_KEY", "ssl/cuahsi.key")

# CAS authentication for HydroFrame - Parflow
cas_service_url = os.environ.get("CAS_SERVICE_URL", "https://subset.cuahsi.org/hflogin")
cas_server_url = os.environ.get(
    "CAS_SERVER_URL", "https://fed.princeton.edu/cas/login?method=GET"
)

debug = os.environ.get("DEBUG", True)
static_path = os.environ.get(
    "STATIC_PATH", os.path.join(os.path.dirname(__file__), "static")
)
template_path = os.environ.get(
    "TEMPLATE_PATH", os.path.join(os.path.dirname(__file__), "templates")
)

cookie_secret = os.environ.get(
    "COOKIE_SECRET", "554451427aba042faa7f7c80ff8337717d7805d26af5707b5102b73fc873cef3"
)

# hydroshare oauth
oauth_client_id = os.environ.get(
    "OAUTH_CLIENT_ID", "TjMr7rPA8AkjVvJgDohn0QEIZ2fKDoPNVjVLKYXz"
)
oauth_client_secret = os.environ.get(
    "OAUTH_CLIENT_SECRET",
    "Yy5FhCXJQ5C9HRpv467bCkLma8vq1nRk69gl4l0V8qcTOXONR4fO8KCdZv6V0MWsViK1iUK5TFMC0NrX8VaL1lOkejLjTUHdz8qa6QWY2JYa6wbHxZyNdncx5qyACuHR",
)
oauth_callback_url = os.environ.get(
    "OAUTH_CALLBACK_URL", "https://subset.cuahsi.org/authorize"
)

# REDIS
redis_url = os.environ.get("REDIS_URL", "localhost")
redis_port = os.environ.get("REDIS_PORT", "6379")

# multiprocessing settings
worker_count = os.environ.get("WORKER_COUNT", 4)

# logging settings
log_dir = os.environ.get("LOG_DIR", "/share/appdata/logs")
log_file_size = os.environ.get("LOG_FILE_SIZE", 1024 * 20 * 1000)
log_count = os.environ.get("LOG_COUNT", 10)

# levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
access_level = os.environ.get("ACCESS_LEVEL", "DEBUG")
application_level = os.environ.get("APPLICATION_LEVEL", "DEBUG")
general_level = os.environ.get("GENERAL_LEVEL", "DEBUG")

# logfiles
pflogfile = os.environ.get("PF_LOG_FILE", "/share/appdata/logs/parflow1.log")
hslogfile = os.environ.get("HS-LOG_FILE", "/share/appdata/logs/hydroshare.log")

# WRF-HYDRO settings
wrfdata = os.environ.get("WRF_DATA", "/share/nwm.v1.2.4")
wrf2data = os.environ.get("WRF_2_DATA", "/share/nwm.v2.0.0")

# Output subset directory
output_dir = os.environ.get("OUTPUT_DIR", "/share/appdata/output")

# Location of jobs database
sqldb = os.environ.get("SQL_DB", "/share/appdata/jobs.db")

# PARFLOW v1.0 settings
pfexedir = os.environ.get("PF_EXE_DIR", "/home/acastronova/parflow")
pfdata_v2 = os.environ.get("PF_DATA_V2", "/share/pfconus.v2.0")
pfdata_v1 = os.environ.get("PF_DATA_V1", "/share/pfconus.v1.0")
pfmask = os.environ.get("PF_MASK", f"{pfdata_v1}/conus_1km_PFmask2.tif")
pflakesmask = os.environ.get(
    "PF_LAKES_MASK", f"{pfdata_v1}/conus_1km_PFmask_selectLakesmask.tif"
)
pflakesborder = os.environ.get(
    "PF_LAKES_BORDER", f"{pfdata_v1}/conus_1km_PFmask_selectLakesborder.tif"
)
pfbordertype = os.environ.get(
    "PF_BORDER_TYPE", f"{pfdata_v1}/1km_PF_BorderCellType.tif"
)
pfsinks = os.environ.get("PF_SINKS", f"{pfdata_v1}/conus_1km_PFmask_manualsinks.tif")
pfslopex = os.environ.get("PF_SLOPE_X", f"{pfdata_v1}/slopex.tif")
pfslopey = os.environ.get("PF_SLOPE_Y", f"{pfdata_v1}/slopey.tif")
pfgrid = os.environ.get("PF_GRID", f"{pfdata_v1}/grid3d.v3.tif")
pfpress = os.environ.get("PF_PRESS", f"{pfdata_v1}/press.in.tif")
gbpl = os.environ.get("PF_GBPL", f"{pfdata_v1}/naigbpl20.tif")
pftemplate = os.environ.get("PF_TEMPLATE", f"{pfdata_v1}/simulation.tcl")
