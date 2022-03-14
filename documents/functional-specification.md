
# Functional Specification  

**Service**: Model Domain Subsetter  
**Author:** Tony Castronova  

## Contents

1. [Project Overview](#1.-project-overview)  
2. [Goals](#2.-goals)  
3. [Non-Goals](#3.-non-goals)  
4. [Known Limitiations](#4.-known-limitations)
5. [System Architecture](#5.-system-architecture)
6. [Features](#6.-features)  
6.1 [Map](#6.1-map)  
6.2 [API](#6.2-api)  
6.3 [Help](#6.3-help)  

## 1. Project Overview

Large scale surface water and groundwater models are an essential tool
for improving our understanding of the dynamic interaction between the
water cycle and human activity. This is especially true when investigating
human impacts, extreme hydrologic events, and future water resource
availability. Results from these models advance hydrologic science and inform
neighboring research disciplines—for example drought and flooding forecasts
influence research in biology, sociology, and economics. As a result,
community intellectual contributions to the physics, configuration, and
validation of continental-scale models is essential to improving the
usefulness and adoption of these models within the academic community. Due to
the computational-scale of these models, they often require specialized
computing hardware and vast amounts of domain and forcing data, making it
difficult for the broader water science community to directly engage in
development efforts. The Consortium of Universities for the Advancement of
Hydrologic Science, Inc and the National Center for Atmospheric Research have
recognized this challenge and are collaborating to improve the accessibility
of model domain data to lower the barrier of entry for using and applying
these models and engage a wide variety scientists and a diverse spectrum of
expertise.

The purpose of this application is to introduce a collaborative effort
for preparing, publishing, and sharing subsets of the National Water
Model input data at watershed scales. With a combination of modern
cyberinfrastructure techniques and state-of-the-science modeling tools,
researchers will have access to subsets of National Water Model information
that would otherwise require extensive computational resources. This work will
provide the foundation onto which similar efforts can be applied to other
large-scale model simulations and input data.

The current architecture implements  a producer-consumer pattern, where some
work is produced by a producer and completed by some consumer. More
concretely, in our case, it consists of a front-end web interface that
receives job requests, produces some work,and passes that work  to a pool of
consumers (workers). The code, data, and dependencies required to execute
jobs are pre-installed on the system; as such, workers run code existing on
the system parameterized by job requirements. Once a job is complete, the
resulting payload is downloaded via the front-end web-ui.

## 2. Goals

- Provide a web interface for obtaining the static model files and parameters
necessary to execute hydrologic models that have been developed at the CONUS
scale, at local and regional scales.

- Provide guidance to the CUAHSI community regarding the configuration
and execution of all supported hydrologic models.

- Support subsetting functionality for multiple hydrologic models and
multiple model versions.

- Allow new subsetting algorithms to be included with minimal modification
to the core subsetting service and minimal downtime.

## 3. Non-Goals

- This services is limited to catchment scale hydrologic modeling
applications. We have not fully evaluated the performance of this service
and therefore have arbitrarily decide that this version of the application
should only be applied at local and regional scales.

- This version of the software will reuse as much existing code as possible.
As a result, it will leverage multiple programming languages, wrapped in
Python 3.6. Future versions will migrate R code to Python as necessary.

- The current version of the software will perform naive bounding box
subsetting, which will not use stream tracing and therefore may not
capture the entire upstream catchment in the subsetted domain.

    **NWM Specific**  

- Model nudging files will not be included in the subsets.

- Due to the limited availability of NWM restart files this service will
not provide access to them.

## 4. Known Limitations

There are several disadvantages to the current implementation, specifically:

- A growth in job types increases the number of dependencies installed on
the system. This increases the likelihood of dependency versioning issues.

- Large VMs are necessary to support the wide-range of job requirements,
e.g. computational requirements such as RAM, CPU, etc. This will become
cost prohibitive as the service expands in the future.

- Adding new jobs requires modifying the front-end UI.

- The architecture is highly coupled and difficult to test locally, any
addition of job types magnifies this issue.

## 5. System Architecture

In general, the domain subsetter is comprised of a (1) front-end web
interface, (2) a back-end web server, (3) a database to store job
status, (4) a Redis server to facilitate communication between
the front-end and back-end components, and (5) input and output storage.
The diagram below illustrates the high-level architecture of the system.

![System-architecture-0.1](./img/system-architecture-0.1.png)

Figure 1: Overview of System Architecture.

### 5.1 Web Interface

The website interface is built using the Tornado framework, the map interface
is written in Javascript and uses the Leaflet software package. All website
documentation is written in Markdown and is “compiled” into html using a
utility script and rendered using Jinja templates. Both the web API and the
user interface are code

The primary responsibility of the web interface is to provides a mechanism
for users to select watershed areas and submit them to the back-end subsetting
workers. As such, this largely consists of documentation and an interactive map
for selecting spatial extents using predefined hydrologic boundaries (i.e. NHD
HUC boundaries). Selections on the map are communicated to the back-end server
through a standard application programming interface (API).

Once a job is submitted for processing, the web interface renders status
messages obtained from the REDIS database using web sockets. Once the job is
complete, the web interface provides a mechanism for results to be downloaded
over HTTP.

#### 5.1.1 Map

![Map 0.1](./img/map-0.1.png)

Figure 2: Map Interface.

The map interface is rendered using Leaflet and provides an interactive means
for users to select domain extent. There exist several additional features to
assist in this process including manually adding boundaries via HUC code as
well as wildcard expansion that allows users to select all HUC-12 boundaries
with larger areas (e.g. 10013209\*).

While the map interface requires domain boundaries to be specified via
HUC-12's, the interface provides additional watershed boundaries to assist in
the identification and selection process.  Additionally, USGS gage locations
are included in the map interface so users can identify reach outlets.

Because a full software performance evaluation has not been performed, users
are currently limited to area of moderate size. This threshold was chosen
arbitrarily and, if exceeded, the *Submit* button will become deactivated.

##### 5.1.1.1 Key Features

- Customized maps based on hydrologic model and model version
(e.g. NWM v1.2, NWM v2.0, Parflow v1.0).

- Watershed boundary layers: HUC 2, 4, 10, 12.

- One selectable/de-selectable layer, HUC 12.

- Ability to manually watershed boundaries using HUC codes.
This also supports wildcard expansion to select all HUC's within
a parent boundary.

- USGS gage locations and popup metadata that includes ID and Name.

- Map selection clearing.

##### 5.1.1.2 Implementation Notes

- The front-end website uses the Tornado v5.1 framework.

- Map interface is written in Javascript and uses the leaflet software package.

- Documentation is written in Markdown and transpiled  into html
and rendered in Jinja templates.

##### 5.1.1.3 Model Specific Notes

For the NWM (v1.2 and v2.0), the map interface passes the bounding box
encapsulating the select region as input to the subsetting algorithm.
This means that user must only select watershed boundaries until the
bounding box spans their entire area of interest.

For Parflow (PF-CONUS v1.0), data is not available for the entire CONUS.
This is indicated using a gray mask that overlays the map interface,
however this does not prevent users from selecting watershed boundaries
outside of the supported region. The map interface passes a list of HUC
ids to the backend server as input to the Parflow subsetting algorithm.

#### 5.1.2 Job Database

A SQLite database for storing jobs that have been submitted and their status:
`success`, `in progress`, or `failed`. The primary purpose of this database
is to obtain general community usage of the platform.

#### 5.1.3 Data Download

Data download using out-of-the-box Tornado functionality and serves files over HTTP.

### 5.2 Application Programming Interface

The API is implemented as part of the web interface described above and uses
the Tornado web framework. It contains all website endpoints, including
map interface, documentation, as well as endpoints for submitting jobs,
tracking job progress, and obtaining completed results.

#### 5.2.1 Endpoints

##### Core

- `/`: Render homepage
- `/about`: Render "about" page
- `/help`: Render "help" page
- `/api`: Render API documentation pages
- `/getting-started`: Render getting started pages
- `/jobs/([a-f0-9]{40})`: Get information about a jobs
- `/status`: Get job status
- `/download-zip/([a-f0-9]{40})`: Get results as Zip archive
- `/download-gzip/([a-f0-9]{40})`: Get results as GZip archive

##### Subsetting

- `/parflow/v1_0`: Render Parflow v1.0 subsetting map
- `/parflow/v1_0/subset`: Submit a parflow v1.0 subsetting job
- `/nwm/v1_2_2`: Render NWM v1.2.2 subsetting map
- `/nwm/v1_2_2/subset`: Submit a NWM v1.2.2 subsetting job
- `/nwm/v2_0`: Render NWM v2.0 subsetting map
- `/nwm/v2_0/subset`: Submit a NWM v2.0 subsetting job

##### HydroShare

- `/login`: Login to HydroShare using OAuth
- `/authorize`: OAuth redirect endpoint
- `/save-to-hydroshare/([a-f0-9]{40})`: Save subsetting results to
HydroShare as a new resource

##### REDIS Communication

- `/socket/([a-f0-9]{40}`: Establish a socket connection using job identifier

##### HydroFrame

- `/hflogin`: Log into HydroFrame account at Princeton
- `/hflogout`: Log out of HydroFrame account/
- `/hfisauthenticated`: check if the current user is authenticated
with HydroFrame

### 5.3 Job Scheduler and Workers

The job scheduler and worker queue are implemented as part of the website
described above. Jobs are executed asynchronously using the Python
Multiprocessing library and a “worker-manager” paradigm. All jobs are
executed on the same system as the web interface. Since all jobs are
executed on the same system, this means that all subsetting dependencies
must be preconfigured and installed on the system.

Jobs are stored in a Python Multiprocessing Queue. Workers are currently
implemented as a Python multiprocessing pool on the same server as the
web interface. All job dependencies are installed in the same
Anaconda environment which poses challenges when supporting a larger range
of jobs.

#### 5.3.1 Implementation Notes

- Jobs are executed asynchronously using the Python Multiprocessing library
and a “worker-manager” paradigm. All jobs are executed on the same system
as the front-end website.

- Job progress is tracked by passing log messages through a REDIS database.

- Workers are currently implemented as a Python multiprocessing pool
on the same server as the front-end.

- All job dependencies are installed in the same Anaconda environment
which poses challenges when supporting a larger range of jobs.

#### 5.4 Job Status

Job status updates are communicated from workers to the front-end interface
via a REDIS database. Messages are stored in the database using unique jobs
identifiers that are queried on the front-end interface using web sockets.
This provides a simple mechanism to provide status updates in real-time
during the subsetting process.

### 5.5 Deployment

Currently, this service is deployed as a series of Docker containers on the
Google Cloud Platform, orchestrated using `docker-compose`. Further details
about these containers is listed below:

- `cuahsi/subsetter-ubuntu:0.1`

    The primary website container. This container is responsible for providing
    the map UI, help and documentation, API, workers and job queues.

- `redis:alpine`

    The REDIS container facilitates status updates between workers and the
    front-end interface.

## 6. Key Features

### 6.1 Map

- Customized maps based on hydrologic model and model version
  - NWM v1.2
  - NWM v2.0
  - Parflow v1.0.

- Watershed boundary layers: HUC 2, 4, 10, 12.

- One selectable/de-selectable layer; HUC 12.

- Manual selection of watershed boundaries by HUC code. This also supports
wild card expansion which can be used to select all HUC boundaries within
a basin.

- USGS gage locations and popup metadata that includes ID and Name.

- Map selection clearing.

### 6.2 API

- Endpoint for subsetting NWM v1.2.2, minimal documentation.

- Endpoint for obtaining job status, minimal documentation.

- Endpoint for downloading results, minimal documentation.

### 6.3 Help

- Minimal documentation for using the NWM and Parflow models.

