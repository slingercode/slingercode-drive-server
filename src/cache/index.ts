import redis from "../lib/redis";

const get = async (key: string): Promise<{ data: string | null; error: string | null }> => {
  try {
    const cache = await redis.get(key);

    if (!cache) {
      throw new Error("Cache not exists");
    }

    return { data: cache, error: null };
  } catch (error: any) {
    return { data: null, error: (error as Error).message };
  }
};

const set = async (
  key: string,
  value: string,
): Promise<{ data: boolean | null; error: string | null }> => {
  try {
    await redis.set(key, value);

    return { data: true, error: null };
  } catch (error: any) {
    return { data: false, error: (error as Error).message };
  }
};

const del = async (
  key: string,
): Promise<{ data: boolean | null; error: string | null }> => {
  try {
    await redis.del(key);

    return { data: true, error: null };
  } catch (error: any) {
    return { data: false, error: (error as Error).message };
  }
};

export default { get, set, del };
