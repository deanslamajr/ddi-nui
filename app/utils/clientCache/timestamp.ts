import store from "store2";

import { LATEST_TIMESTAMP_CACHE_KEY } from "./index";

export const setLatestTimestamp = (latestTimestamp: number) => {
  store.session(LATEST_TIMESTAMP_CACHE_KEY, latestTimestamp);
};

export const getLatestTimestamp = (): number => {
  const latestTimestamp = store.session(LATEST_TIMESTAMP_CACHE_KEY);
  return latestTimestamp;
};
