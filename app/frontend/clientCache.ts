import store from "store2";

import { STORAGEKEY_STUDIO } from "~/utils/constants";

type ClientCacheCell = {
  hasNewImage: boolean;
  urlId: string;
  imageUrl: string | null;
  comicUrlId: string;
  previousCellUrlId: string | null;
  studioState: object;
};

type ClientCacheComic = {
  initialCellUrlId: string;
};

type ClientCacheSchema = {
  cells: Record<string, ClientCacheCell>;
  comics: Record<string, ClientCacheComic>;
};

const cache = store.namespace(STORAGEKEY_STUDIO);

// const getCache = (): ClientCacheSchema => {
//   return store.namespace(STORAGEKEY_STUDIO);
// };

// const setCache = (newCache: ClientCacheSchema) => {
//   store(STORAGEKEY_STUDIO, newCache);
// };

const LATEST_TIMESTAMP = "LATEST_TIMESTAMP";

export const setLatestTimestamp = (latestTimestamp: number) => {
  cache.session(LATEST_TIMESTAMP, latestTimestamp);
};

export const getLatestTimestamp = (): number => {
  const latestTimestamp = cache.session(LATEST_TIMESTAMP);
  return latestTimestamp;
};
