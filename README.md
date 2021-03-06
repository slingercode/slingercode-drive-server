# slingercode drive server

## Environment Variables

Create a `.env` file and insert the variables below

- `APP_PORT`: The port in which the app is going to listen
- `APP_CORS_ORIGINS`: A comma separated list to indicate the allowed origins for the server
- `AUTH0_AUDIENCE`: Audience scope for Auth0
- `AUTH0_DOMAIN`: Issuer domain for Auth0
- `AWS_S3_BUCKET`: Name of a bucket of AWS S3 instance
- `MONGO_URI`: Connection string of a MongoDb instance
- `MONGO_DB_NAME`: Database name
- `REDIS_HOST`: Host of a Redis instance
- `REDIS_PORT`: Port of the redis instance

## Redis

Set a local instance of [Redis](https://redis.io) with the next command

```shell
docker run --rm  \
  --name redis \
  -p 6379:6379 \
  -v "LOCAL_DIRECTORY":/data \
  -d redis:alpine3.15 \
    --save 60 1
```

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

```shell
.
├── .env
├── client
│   └── Dockerfile
├── docker-compose.yml
└── server
    └── Dockerfile
```

To help this process, a `.env` file must be created with both versions, the server and the client

**NOTE: Both client and server repositories has the same `docker-compose.yml` version, and is only for development purpose**

## API Structure

All the API calls are going to follow these order of execution

- Basic security

  - Authentication
  - Body validation
  - Declarations

- Cache
- DB Connections
- Success state
- Error state

## Usefull links

- [AWS SDK JS v3](https://betterdev.blog/aws-javascript-sdk-v3-usage-problems-testing/)
- [AWS SDK JS v3 S3 Readable type](https://github.com/aws/aws-sdk-js-v3/issues/1877)
