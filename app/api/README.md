# Subsetter FastAPI

A python FastAPI application that can submit the subsetter workflow templates to an argo instance updated with the subsetter workflow templates at `./argo/`.

The Dockerfile declares a python base image and installs the dependencies declared in `requirements.txt` and `requirements-dev.txt` and starts up the FastApi application at port 8000.

`subsetter/main.py` is the entrypoint to the FastAPI application, configures the routers. The file also contains a startup event hook that initialized the mongodb database with [beanie ODM](https://beanie-odm.dev/).  The startup event hook also sets up a minio client for the [CUAHSI MinIO instance](https://console.minio.cuahsi.io).  The minio client is used for synchronizing user specific access policies and keys/secrets.

API documentation is rendered at https://subsetter-api-jbzfw6l52q-uc.a.run.app/redoc (This will be updated to https://api.subsetter.cuahsi.io/redocs pending certificate creation).  OpenAPI spec documentation is generated from the code defining the api endpoints (FastAPI) and input/output models (Pydantic).

User authentication is achieved by configuring the [fastapi_users](https://github.com/fastapi-users/fastapi-users) module with [CUAHSI SSO](https://auth.cuahsi.org/) using the `OpenID Connect` protocol.  On registration a S3 bucket is created for the user on [CUAHSI MinIO](https://console.minio.cuahsi.io) (TODO: create a default quota of 5 GB). An admin may increase the quota on a case by case basis.

The Subsetter API is divided into 4 routers defined at `subsetter/app/routers/`.

## Routers
### Access Control Router
The `access_control` router contains prototyped synchronization of view/edit access to paths on MinIO that have a HydroShare resource that references a path on the CUAHSI MinIO instance.  In the [mongo_discovery-access-control](https://github.com/hydroshare/hydroshare/compare/develop...mongo-discovery-access-control) HydroShare branch, event hooks are created for exporting Resource and User access to a mongo database.  This mongo database is accessed to look up the resources which a user has view/edit privileges and generates the view/edit policies that are assigned to the user on CUAHSI MinIO storage.  This means a path in a user's bucket may be registered on HydroShare and enjoy the same access control capabilities of a HydroShare Composite Resource.

### Argo Router
Contains the api endpoints for submitting a subsetter workflow, tracking submissions, and generating a presigned download url to the resulting datasets.

### Discovery Router
A copy of the IGUIDE discovery router that includes endpoints for searching resource metadata.  The Subsetter workflows run the hydroshare metadata extraction tool to extract metadata the same metadata that a HydroShare composite resource will extract from recognized file formats.  The resulting metadata can then be written to the Discovery database on Atlas.  TODO: collect the metadata extracted from subsetter outputs into a discovery database.

### Storage Router
Contins the endpoints to generate presigned urls for PUT and GET of objects on S3.  This is not currently used but could be used to create a resource landing page for resources stored on S3 equivalent to a resource on HydroShare.  


