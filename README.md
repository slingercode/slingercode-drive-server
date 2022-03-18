# slingercode drive server

## Environment Variables

Create a `.env` file and insert the variables below

- `APP_PORT`: The port in which the app is going to listen
- `APP_CORS_ORIGINS`: A comma separated list to indicate the allowed origins for the server

## Build image (local)

We can use the following script in order to build and run the image locally:

Create a file `docker-build.sh` and paste the script remplazing the ENV VARS with the
values in `.env` file

**NOTE: THIS FILE SHOULD NOT BE ADDED TO GIT**

```shell
docker build .\
  --build-arg APP_CORS_ORIGINS="APP_CORS_ORIGINS"\
  --build-arg APP_PORT="APP_PORT"\
  --tag slingercode-drive-server:$(git log -1 --format=%h) &&
docker run --name slingercode-drive-server -d -p "APP_PORT":8000\
  slingercode-drive-server:$(git log -1 --format=%h)
```

### Docker compose

In order to facilitate the build and execution of the client and server images,
we can create a `docker-compose.yml` file in a general context of the
two repositories:

```
client
  |
   - Dockerfile
server
  |
   - Dockerfile
.env
docker-compose.yml
```

To help this process, a `.env` file must be created with both versions, the server and the client

**NOTE: Both client and server repositories has the same `docker-compose.yml` version, and is only for development purpose**
