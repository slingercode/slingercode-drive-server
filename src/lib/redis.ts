import Redis from "ioredis";
import ENV from "../config/env";

const redis: Redis.Redis = new Redis({
  host: ENV.REDIS.HOST,
  port: parseInt(ENV.REDIS.PORT),
});

export default redis;
