### Application Programming Interface

There are three REST endpoints in version 0.1 of the subsetting tool: subset, jobs, and data (Figure 3). The subset endpoint accepts bounding box coordinates in the WGS84 spatial reference system, and uses these data to (1) validate the bounding box, (2) convert into the coordinate system used by NWM (an Albers Conformal Conic variant), and (3) submit the job to run as a background task. The jobs endpoint is used to lookup the status of any given job via unique identifier. Finally, the data endpoint is used to download the subsetted domain data via unique identifier. Technical details for each endpoint outlined below.

<button id=p1 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /jobs</h5>
<div id=p1 class="panel">
  <p>A collapsible region</p>
</div>
- Description: gets the status of all jobs
- Returns: json string of all known jobs on the server
- Parameters: None

<button id=p2 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try 
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /jobs/{id}</h5>
<div id=p2 class="panel">
  <p>A collapsible region</p>
</div>
- Description: gets the status of the job {id} in json
- Returns: a json string for the status of job {id}
- Parameters: 
    - id: the unique identifier for the job

<button id=p3 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /subset?{params}</h5>
<div id=p3 class="panel">
  <p>A collapsible region</p>
</div>
- Description: submits a new subsetting job
- Returns: a json string containing the a unique job identifier
- Parameters:
    - llat: the lower latitude of the bounding box in WGS84
    - llon: the lower longitude of the bounding box in WGS84
    - ulat: the upper latitude of the bounding box in WGS84
    - ulon: the upper longitude of the bounding box in WGS84 

<button id=p4 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /data/{id}</h5>
<div id=p4 class="panel">
  <p>A collapsible region</p>
</div>
- Description: gets the file created by the subsetting algorithm
- Returns: the location of the file for {id}
- Parameters: 
    - id: the unique identifier for the job
