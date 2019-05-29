import os

# Server settings

address="0.0.0.0"
port="80"

debug=True
static_path = os.path.join(os.path.dirname(__file__), "static")
template_path = os.path.join(os.path.dirname(__file__), "templates")

# multiprocessing settings
worker_count = 4

# logging settings
log_dir = os.path.join(os.getcwd(), 'logs')
log_file_size = 1024 * 20 * 1000
log_count = 10

# levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
access_level = 'INFO'
application_level = 'INFO'
general_level = 'INFO'

# WRF-HYDRO settings
wrfdata = '/share/nwm.v1.2.4'

# Output subset directory
output_dir = '/share/appdata/output'

# Location of jobs database
sqldb = '/share/appdata/jobs.db'


