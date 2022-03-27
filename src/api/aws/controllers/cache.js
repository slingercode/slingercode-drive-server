const cache = require("../../../cache");

async function save(key, value) {
  try {
    const cacheSet = await cache.set(key, value);

    if (cacheSet.error) {
      throw new Error(`${key} - ${cacheSet.error}`);
    }

    return { key, error: null };
  } catch (error) {
    return { key, error: error.message };
  }
}

async function remove(key) {
  try {
    const cacheSet = await cache.delete(key);

    if (cacheSet.error) {
      throw new Error(`${key} - ${cacheSet.error}`);
    }

    return { key, error: null };
  } catch (error) {
    return { key, error: error.message };
  }
}

module.exports = { save, remove };
