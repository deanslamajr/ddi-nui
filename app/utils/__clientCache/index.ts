import store, { StoreType } from "store2";

import { STORAGEKEY_STUDIO } from "~/utils/constants";

export type CellFromClientCache = {
  hasNewImage: boolean;
  urlId: string | null;
  imageUrl: string | null;
  isDirty?: boolean;
  comicUrlId: string | null;
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

export const getCache = (): StoreType => {
  return store.namespace(STORAGEKEY_STUDIO);
};

// const setCache = (newCache: ClientCacheSchema) => {
//   store(STORAGEKEY_STUDIO, newCache);
// };
