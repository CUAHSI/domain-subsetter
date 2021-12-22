# CONUS Subsetting

This is a CUAHSI service for providing access to static domain datasets for CONUS hydrologic models.

## Run Service

This service uses Docker to containerize dependencies for the subsetting operations. As such, we recommend that you use one of the pre-configured `docker-compose` files to run the service.

### Development Mode

```
docker-compose -f docker/docker-compose.dev up -d
```


### Production Mode

The production version of this service is configured with SSL.

```
docker-compose -f docker/docker-compose.prod up -d
```
