import store, { StoreType } from "store2";

import { STORAGEKEY_STUDIO } from "~/utils/constants";

export type CellFromClientCache = {
  hasNewImage: boolean;
  urlId: string;
  imageUrl: string | null;
  comicUrlId: string;
  previousCellUrlId: string | null;
  studioState: object;
};

export type ComicFromClientCache = {
  initialCellUrlId: string;
};

export type ClientCache = {
  cells: Record<string, CellFromClientCache>;
  comics: Record<string, ComicFromClientCache>;
};

const cache = store.namespace(STORAGEKEY_STUDIO);

export const getCache = (): StoreType => {
  return cache;
};

// const setCache = (newCache: ClientCacheSchema) => {
//   store(STORAGEKEY_STUDIO, newCache);
// };
