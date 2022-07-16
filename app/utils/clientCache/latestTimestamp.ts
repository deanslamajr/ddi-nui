import { getCache } from "./";

const LATEST_TIMESTAMP_CACHE_KEY = "LATEST_TIMESTAMP";

export const setLatestTimestamp = (latestTimestamp: number) => {
  const cache = getCache();
  cache.session(LATEST_TIMESTAMP_CACHE_KEY, latestTimestamp);
};

export const getLatestTimestamp = (): number => {
  const cache = getCache();
  const latestTimestamp = cache.session(LATEST_TIMESTAMP_CACHE_KEY);
  return latestTimestamp;
};
