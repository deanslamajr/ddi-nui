import store from "store2";
import shortid from "shortid";

import { DRAFT_SUFFIX, STORAGEKEY_STUDIO } from "~/utils/constants";

import { CellFromClientCache, getCellsByComicUrlId } from "./cell";
import { ComicFromClientCache, getComic, HydratedComic } from "./comic";

export const LATEST_TIMESTAMP_CACHE_KEY = "LATEST_TIMESTAMP";

export type ClientCache = {
  cells: Record<string, CellFromClientCache>;
  comics: Record<string, ComicFromClientCache>;
};

export const getCache = (): ClientCache => {
  const cacheFromStore: ClientCache | null = store(STORAGEKEY_STUDIO);

  if (cacheFromStore !== null) {
    return cacheFromStore;
  }

  // initialize client cache
  const newClientCache = getInitializedCache();
  setCache(newClientCache);

  return newClientCache;
};

export const setCache = (newCache: ClientCache) => {
  store(STORAGEKEY_STUDIO, newCache);
};

export const generateDraftUrlId = () => {
  return `${shortid.generate()}${DRAFT_SUFFIX}`;
};

const getInitializedCache = (): ClientCache => {
  return {
    cells: {},
    comics: {},
  };
};

// export const clearStudioState = (cellUrlId, initialStudioState) => {
//   const newStudioState = initialStudioState || getInitializedStudioState();
//   setCellStudioState(cellUrlId, newStudioState);
// };

export const hydrateComicFromClientCache = (
  comicUrlId: string
): HydratedComic => {
  const comic = getComic(comicUrlId) || ({} as ComicFromClientCache);
  const cells = getCellsByComicUrlId(comicUrlId);

  return {
    ...comic,
    cells,
  };
};
