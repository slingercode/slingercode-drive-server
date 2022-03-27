const redis = require("../lib/redis");

module.exports = {
  get: async function (key) {
    try {
      const cache = await redis.get(key);

      if (!cache || cache === null) {
        throw new Error("Cache not exists");
      }

      return { data: cache, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
  set: async function (key, value) {
    try {
      await redis.set(key, value);

      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: error.message };
    }
  },
  delete: async function (key) {
    try {
      await redis.del(key);

      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: error.message };
    }
  },
};
