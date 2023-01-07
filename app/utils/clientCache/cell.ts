import { validateStudioState } from "../validators";
import { StudioState } from "~/interfaces/studioState";
import { AllCellsFromGetComicApi } from "~/interfaces/comic";
import { sortCellsV4 } from "~/utils/sortCells";
import { SCHEMA_VERSION } from "~/utils/constants";

import {
  CellChangeHistory,
  initializeCellChangeHistory,
} from "~/models/cellChange";

import { ClientCache, generateDraftUrlId, getCache, setCache } from "./index";
import {
  ComicFromClientCache,
  createNewComic,
  doesComicUrlIdExist,
  getComic,
  getComicUrlIdFromCellUrlId,
} from "./comic";

export type CellFromClientCache = {
  hasNewImage?: boolean;
  urlId: string;
  imageUrl?: string | null;
  isDirty?: boolean;
  comicUrlId: string;
  previousCellUrlId?: string | null;
  schemaVersion?: number | null;
  studioState?: StudioState | null;
  changeHistory?: CellChangeHistory;
};

/*******************
 ***********
 * SELECTORS
 */

export const doesCellUrlIdExist = (cellUrlId: string) => {
  const localCache = getCache();
  return Object.keys(localCache.cells).includes(cellUrlId);
};

export const getCellsByComicUrlId = (
  comicUrlId: string,
  cache?: ClientCache
) => {
  const localCache = cache || getCache();

  const cells = Object.values(localCache.cells);
  const comicsCells = cells.filter((cell) => cell.comicUrlId === comicUrlId);
  return comicsCells.reduce((acc, cell) => {
    acc[cell.urlId] = cell;
    return acc;
  }, {} as Record<string, CellFromClientCache>);
};

export const getNewCell = ({
  comicUrlId,
  hasNewImage,
  imageUrl,
  isDirty,
  previousCellUrlId,
  studioState,
  urlId,
}: {
  comicUrlId: string;
  hasNewImage?: boolean;
  imageUrl?:
    | CellFromClientCache["imageUrl"]
    | AllCellsFromGetComicApi["imageUrl"];
  isDirty?: boolean;
  previousCellUrlId?: CellFromClientCache["previousCellUrlId"];
  studioState?:
    | CellFromClientCache["studioState"]
    | AllCellsFromGetComicApi["studioState"];
  urlId?: CellFromClientCache["urlId"] | null;
}): CellFromClientCache => {
  const initialStudioState = validateStudioState(studioState);
  return {
    comicUrlId,
    hasNewImage: hasNewImage || false,
    imageUrl: imageUrl || null,
    isDirty: isDirty || false,
    previousCellUrlId,
    schemaVersion: SCHEMA_VERSION,
    studioState: initialStudioState,
    urlId: urlId || generateDraftUrlId(),
    changeHistory: initializeCellChangeHistory(initialStudioState),
  };
};

/*******************
 ***********
 * UPDATES
 */

export const createNewCell = ({
  comicUrlId,
  initialStudioState,
}: {
  comicUrlId?: string;
  initialStudioState?: StudioState | null;
}): CellFromClientCache => {
  let localCache = getCache();
  let comic: ComicFromClientCache;

  // conditionally: create new comic
  if (!comicUrlId || !doesComicUrlIdExist(comicUrlId, localCache)) {
    comic = createNewComic();
    localCache.comics[comic.urlId] = comic;
  } else {
    updateComicLastModified(comicUrlId, localCache);
    comic = getComic(comicUrlId, localCache)!;
  }

  const getCurrentLastCellUrlId = () => {
    if (!comic.initialCellUrlId) {
      return null;
    }

    const comicsCells = getCellsByComicUrlId(comic.urlId, localCache);

    const sortedCells = sortCellsV4(
      Object.values(comicsCells),
      comic.initialCellUrlId
    );

    const lastCell = sortedCells ? sortedCells[sortedCells.length - 1] : null;

    return lastCell && lastCell.urlId;
  };
  const previousCellUrlId = getCurrentLastCellUrlId();

  // create new cell
  const newCell = getNewCell({
    comicUrlId: comic.urlId,
    hasNewImage: true,
    isDirty: true,
    studioState: initialStudioState,
    previousCellUrlId,
  });

  localCache.cells[newCell.urlId!] = newCell;

  // set new cellId as initialCellUrlId of comic
  if (!previousCellUrlId) {
    localCache.comics[comic.urlId].initialCellUrlId = newCell.urlId!;
  }

  setCache(localCache);

  return newCell;
};

export const deleteCell = (cellUrlId: string, cache?: ClientCache) => {
  const localCache = cache || getCache();

  // get the comic associated with this cellUrlId
  const comicUrlId = getComicUrlIdFromCellUrlId(cellUrlId, localCache);

  if (!comicUrlId) {
    return;
  }

  const deletedCellsPreviousCellUrlId =
    localCache.cells[cellUrlId].previousCellUrlId;
  // delete this cell from the cache
  delete localCache.cells[cellUrlId];

  const comicsCells = Object.values(
    getCellsByComicUrlId(comicUrlId, localCache)
  );

  // if the comic has no more cells associated with it, delete the comic from the cloned cache
  if (localCache.comics[comicUrlId] && !comicsCells.length) {
    delete localCache.comics[comicUrlId];
  } else if (
    localCache.comics[comicUrlId] &&
    cellUrlId === localCache.comics[comicUrlId].initialCellUrlId
  ) {
    // if the cell to delete is the initial cell, set comic.initialCell
    const secondCell = comicsCells.find(
      ({ previousCellUrlId }) => previousCellUrlId === cellUrlId
    );
    if (secondCell) {
      localCache.comics[comicUrlId].initialCellUrlId = secondCell.urlId;
    }
  }

  // if any cells reference this cell as previousCellUrlId
  // update those cell's to reference this cell's previousCellUrlId
  const cellsThatReferenceThisCellAsPreviousCellUrlId = comicsCells.filter(
    ({ previousCellUrlId }) => previousCellUrlId === cellUrlId
  );
  cellsThatReferenceThisCellAsPreviousCellUrlId.forEach(
    (cell) => (cell.previousCellUrlId = deletedCellsPreviousCellUrlId)
  );

  // save cache only if the consumer
  // didn't provide a cache reference
  if (cache) {
    setCache(localCache);
  }
};

export const setCellStudioState = (
  cellUrlId: string,
  newStudioState: StudioState,
  options: {
    cache?: ClientCache;
    setHasNewImage?: boolean;
  } = {}
) => {
  const localCache = options.cache || getCache();

  const cellToUpdate = localCache.cells[cellUrlId];

  cellToUpdate.studioState = newStudioState;
  cellToUpdate.isDirty = true;

  if (options.setHasNewImage) {
    cellToUpdate.hasNewImage = true;
  }

  updateComicLastModified(cellToUpdate.comicUrlId, localCache);

  setCache(localCache);
};

export const updateComicLastModified = (
  comicUrlId: string,
  cache?: ClientCache
) => {
  const localCache = cache || getCache();

  const comicToUpdate = getComic(comicUrlId, localCache);

  if (comicToUpdate === null) {
    console.error(
      `clientCache::updateComicLastModified - a comic with comicUrlId:${comicUrlId} does not exist in clientCache. Consequently, no update was executed.`
    );
    return;
  }

  comicToUpdate.lastModified = Date.now();
};
