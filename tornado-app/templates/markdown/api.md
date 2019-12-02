
There are four public REST endpoints in version 0.1 of the CUAHSI subsetter: subset, gethucbox, jobs, and data (see Figure 1). The subset endpoint accepts bounding box coordinates in the WGS84 spatial reference system and uses these data to (1) validate the bounding box, (2) convert into the coordinate system used by NWM (an Albers Conformal Conic variant), and (3) submit the job to run as a background task. The jobs endpoint is used to lookup the status of any given job via unique identifier. Finally, the data endpoint is used to download the subset domain data via unique identifier. Technical details for each endpoint outlined below.

<div class='mdl-grid center-horizontally info-page'>
<img src="{{ static_url('images/architecture.png') }}" alt="system-archiecture" style='max-width:600px;width:80%;height:auto'>
</div>

<button id=p3 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /nwm/v1_2_2/subset?{params}</h5>
<div id=p3 class="panel">
  <p>
  <a href=http://subset.cuahsi.org:8080/nwm/v1_2_2/subset?llat=-511677.79030000046&llon=1435517.3967999965&ulat=-505666.89020000043&ulon=1442976.6818999965 target='_blank'>`http://subset.cuahsi.org:8080/nwm/v1_2_2/subset?llat=-511677.79030000046&llon=1435517.3967999965&ulat=-505666.89020000043&ulon=1442976.6818999965`</a>
  </p>
</div>
- Description: submits a new subsetting job for the NWM v1.2.2 domain data. 
- Returns: a json string containing the a unique job identifier. This job identifier can be used to check the status of the job.
- Parameters (*all coordinates are in the Spherical Lambert Conformal Conic SRS*):
    - llat: the lower latitude of the bounding box 
    - llon: the lower longitude of the bounding box
    - ulat: the upper latitude of the bounding box 
    - ulon: the upper longitude of the bounding box


<button id=p2 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try 
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /jobs/{id}</h5>
<div id=p2 class="panel">
  <p>
  <a href=http://subset.cuahsi.org:8080/jobs/2b51d4b68eb675421de14f75d6bd72b35f1d3524 target='_blank'>`http://subset.cuahsi.org:8080/jobs/2b51d4b68eb675421de14f75d6bd72b35f1d3524`</a>
  </p>
</div>
- Description: gets the status of an existing job 
- Returns: a json string containg the job `id`, `status`, and output `file` location (if job has completed)
- Parameters: 
    - id: the unique identifier for the job


<button id=p1 class="mdl-button mdl-button--colored mdl-button--raised is-upgraded accordion">
    Try
</button>
<h5 style="display:inline-block;padding-right:10px">GET - /data/{id}.tar.gz</h5>
<div id=p1 class="panel">
<p>
  <a href=http://subset.cuahsi.org:8080/data/2b51d4b68eb675421de14f75d6bd72b35f1d3524.tar.gz target='_blank'>`http://subset.cuahsi.org:8080/data/2b51d4b68eb675421de14f75d6bd72b35f1d3524.tar.gz`</a>
</p>
</div>
- Description: downloads the subsetted data via job id
- Returns: data archived in tar.gz 
- Parameters: 
    - id: the unique identifier for the job
