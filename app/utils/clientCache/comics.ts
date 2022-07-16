import type {
  ClientCache,
  CellFromClientCache,
  ComicFromClientCache,
} from "./";
import { getCache } from "./";

import { getCellsByComicUrlId } from "./cells";

const COMICS_CACHE_KEY = "comics"; // needs to be backwards compatible with v1 cache

export const doesComicUrlIdExist = (comicUrlId: string) => {
  const comicsFromCache = getComics();
  if (!comicsFromCache) {
    return false;
  }
  return Object.keys(comicsFromCache).includes(comicUrlId);
};

export const getComic = (comicUrlId: string): ComicFromClientCache | null => {
  const cachedComics = getComics();

  if (!cachedComics) {
    return null;
  }

  return cachedComics[comicUrlId];
};

export const getComics = (): ClientCache["comics"] | undefined => {
  const cache = getCache();
  return cache(COMICS_CACHE_KEY);
};

export type HydratedComic = {
  initialCellUrlId: string;
  cells: Record<string, CellFromClientCache> | null;
};

export const hydrateComicFromClientCache = (
  comicUrlId: string
): HydratedComic | null => {
  const comic = getComic(comicUrlId);
  if (!comic) {
    return null;
  }

  const cells = getCellsByComicUrlId(comicUrlId);

  return {
    ...comic,
    cells,
  };
};
