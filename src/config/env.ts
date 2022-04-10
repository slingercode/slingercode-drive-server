const ENV = {
  APP: {
    PORT: process.env.APP_PORT || 8000,
    CORS_ORIGINS: process.env.APP_CORS_ORIGINS || "http://localhost:3000",
  },
  AUTH0: {
    DOMAIN: process.env.AUTH0_DOMAIN || "",
    AUDIENCE: process.env.AUTH0_AUDIENCE || "",
  },
  AWS: {
    BUCKET: process.env.AWS_S3_BUCKET || "",
  },
  MONGO: {
    URI: process.env.MONGO_URI || "mongodb://localhost:27017",
    DB_NAME: process.env.MONGO_DB_NAME || "test",
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || "localhost",
    PORT: process.env.REDIS_PORT || "6379",
  },
};

export default ENV;
