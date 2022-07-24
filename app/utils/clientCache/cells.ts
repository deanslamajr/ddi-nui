import type { ClientCache, CellFromClientCache } from "./";
import { getCache } from ".";

// this string is identical to the v1 version
// as it needs to be backwards compatible with the v1 cache
const CELLS_CACHE_KEY = "cells";

export const getCells = (): ClientCache["cells"] | undefined => {
  const cache = getCache();
  return cache(CELLS_CACHE_KEY);
};

export const getCellsByComicUrlId = (
  comicUrlId: string
): Record<string, CellFromClientCache> | null => {
  const cellsFromCache = getCells();
  if (!cellsFromCache) {
    return null;
  }

  const cells = Object.values(cellsFromCache);
  const comicsCells = cells.filter((cell) => cell.comicUrlId === comicUrlId);
  return comicsCells.reduce((acc, cell) => {
    acc[cell.urlId] = cell;
    return acc;
  }, {} as Record<string, CellFromClientCache>);
};

type StudioState = {};

export const getInitializedStudioState = (): StudioState => {
  return {
    activeEmojiId: null,
    backgroundColor: "#FFFAF9",
    caption: "",
    currentEmojiId: 1,
    emojis: {},
  };
};

export const getInitializedCell = ({
  comicUrlId = null,
  hasNewImage = false,
  imageUrl = null,
  isDirty = false,
  previousCellUrlId,
  studioState = getInitializedStudioState(),
  urlId = null,
}: CellFromClientCache): CellFromClientCache => {
  return {
    comicUrlId,
    hasNewImage,
    imageUrl,
    isDirty,
    previousCellUrlId,
    studioState,
    urlId,
  };
};
