import store from "store2";
import shortid from "shortid";

import { sortCellsV4, sortCellsFromGetComic } from "~/utils/sortCells";
import {
  DRAFT_SUFFIX,
  SCHEMA_VERSION,
  STORAGEKEY_STUDIO,
} from "~/utils/constants";

import { validateStudioState } from "./validators";

import { StudioState } from "~/interfaces/studioState";

import {
  AllCellsFromGetComicApi,
  ComicFromGetComicApi,
} from "~/interfaces/comic";

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

const generateDraftUrlId = () => {
  return `${shortid.generate()}${DRAFT_SUFFIX}`;
};

// CACHE SCHEMA
//

export type CellChange = {
  id: string;
  studioState: StudioState;
  prevChangeId: string | null;
  nextChangeId: string[];
};

export type CellChangeHistory = {
  currentChangeId: string;
  changes: Record<string, CellChange>;
};

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

export type ComicFromClientCache = {
  initialCellUrlId: string | null;
  lastModified: number;
  urlId: string;
};

export type HydratedComic = ComicFromClientCache & {
  cells: Record<string, CellFromClientCache> | null;
};

const LATEST_TIMESTAMP_CACHE_KEY = "LATEST_TIMESTAMP";

export const setLatestTimestamp = (latestTimestamp: number) => {
  store.session(LATEST_TIMESTAMP_CACHE_KEY, latestTimestamp);
};

export const getLatestTimestamp = (): number => {
  const latestTimestamp = store.session(LATEST_TIMESTAMP_CACHE_KEY);
  return latestTimestamp;
};

const getInitializedCache = (): ClientCache => {
  return {
    cells: {},
    comics: {},
  };
};

const createNewComic = (
  template?: Partial<ComicFromClientCache>
): ComicFromClientCache => {
  return {
    initialCellUrlId: template?.initialCellUrlId || null,
    lastModified: Date.now(),
    urlId: template?.urlId || generateDraftUrlId(),
  };
};

export const addNewCellChangeToHistory = (
  cellState: CellFromClientCache,
  studioStateResultingFromChange?: StudioState
): void => {
  if (!cellState.changeHistory) {
    const newCellChangeHistory = initializeCellChangeHistory(
      studioStateResultingFromChange || cellState.studioState!
    );
    cellState.changeHistory = newCellChangeHistory;
    return;
  }

  const prevChangeId = cellState.changeHistory.currentChangeId;

  const newCellChange = generateCellChange({
    prevChangeId,
    studioStateResultingFromChange:
      studioStateResultingFromChange || cellState.studioState!,
  });

  // add new change to history
  cellState.changeHistory.currentChangeId = newCellChange.id;
  cellState.changeHistory.changes[newCellChange.id] = newCellChange;

  // add new change reference to previous change
  const prevChange = cellState.changeHistory.changes[prevChangeId];

  if (prevChange) {
    prevChange.nextChangeId.unshift(newCellChange.id);
  }
};

const generateCellChange = ({
  prevChangeId,
  studioStateResultingFromChange,
}: {
  prevChangeId?: string;
  studioStateResultingFromChange: StudioState;
}): CellChange => {
  return {
    id: shortid.generate(),
    studioState: studioStateResultingFromChange,
    prevChangeId: prevChangeId || null,
    nextChangeId: [],
  };
};

const initializeCellChangeHistory = (
  initialStudioState: StudioState
): CellChangeHistory => {
  const newCellChange = generateCellChange({
    studioStateResultingFromChange: initialStudioState,
  });
  return {
    currentChangeId: newCellChange.id,
    changes: {
      [newCellChange.id]: newCellChange,
    },
  };
};

const getInitializedCell = ({
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

export const getComicUrlIdFromCellUrlId = (
  cellUrlId: string,
  cache?: ClientCache
) => {
  const localCache = cache || getCache();

  const cell = localCache.cells[cellUrlId];

  if (!cell) {
    return null;
  } else {
    return cell.comicUrlId;
  }
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

export const deleteComic = (comicUrlId: string) => {
  // get the latest cache
  let cache = getCache();

  delete cache.comics[comicUrlId];

  const cellsAssociatedWithDeletedComic = Object.keys(
    getCellsByComicUrlId(comicUrlId, cache)
  );

  cellsAssociatedWithDeletedComic.forEach((cellUrlId) =>
    deleteCell(cellUrlId, cache)
  );

  setCache(cache);
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

export const doesCellUrlIdExist = (cellUrlId: string) => {
  const localCache = getCache();
  return Object.keys(localCache.cells).includes(cellUrlId);
};

export const doesComicUrlIdExist = (
  comicUrlId: string,
  cache?: ClientCache
) => {
  const localCache = cache || getCache();
  if (!localCache || !localCache.comics) {
    return false;
  }
  return Object.keys(localCache.comics).includes(comicUrlId);
};

export const getComic = (comicUrlId: string, cache?: ClientCache) => {
  const localCache = cache || getCache();

  if (!localCache.comics || !localCache.comics[comicUrlId]) {
    return null;
  }

  return localCache.comics[comicUrlId];
};

const updateComicLastModified = (comicUrlId: string, cache?: ClientCache) => {
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
  const newCell = getInitializedCell({
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

// export const clearStudioState = (cellUrlId, initialStudioState) => {
//   const newStudioState = initialStudioState || getInitializedStudioState();
//   setCellStudioState(cellUrlId, newStudioState);
// };

export const getComics = (): Record<string, ComicFromClientCache> => {
  return getCache().comics;
};

export const getDirtyComics = (): HydratedComic[] => {
  const comics = getComics();

  const dirtyComics = Object.values(comics).filter(({ urlId }) => {
    const cells = getCellsByComicUrlId(urlId);
    return Object.values(cells).some(({ isDirty }) => isDirty);
  });

  return dirtyComics.reduce((acc, dirtyComic) => {
    const cells = getCellsByComicUrlId(dirtyComic.urlId);
    return [
      ...acc,
      {
        ...dirtyComic,
        cells,
      },
    ];
  }, [] as HydratedComic[]);
};

export const copyComicFromPublishedComic = (
  publishedComic: ComicFromGetComicApi,
  shouldUpdateCache?: boolean
): HydratedComic =>
  createComicFromPublishedComic({
    comicFromGetApi: publishedComic,
    shouldDuplicateComic: true,
    shouldUpdateCache,
  });

export const createComicFromPublishedComic = ({
  comicFromGetApi,
  shouldDuplicateComic,
  shouldUpdateCache,
}: {
  comicFromGetApi: ComicFromGetComicApi;
  shouldDuplicateComic?: boolean;
  shouldUpdateCache?: boolean;
}): HydratedComic => {
  const cache = shouldUpdateCache && getCache();

  const comicUrlId = shouldDuplicateComic
    ? generateDraftUrlId()
    : comicFromGetApi.urlId;

  const sortedCellsToCopy = sortCellsFromGetComic(comicFromGetApi);

  let comic;
  const cells: Record<string, CellFromClientCache> = {};

  if (shouldDuplicateComic) {
    let newComicInitialCellUrlId;
    for (
      let currentCellIndex = 0;
      currentCellIndex < sortedCellsToCopy.length;
      currentCellIndex++
    ) {
      const currentCell = sortedCellsToCopy[currentCellIndex];

      const newCellUrlId = generateDraftUrlId();
      if (currentCellIndex === 0) {
        newComicInitialCellUrlId = newCellUrlId;
      }

      const cell = getInitializedCell({
        comicUrlId,
        urlId: newCellUrlId,
        studioState: currentCell.studioState,
        previousCellUrlId:
          currentCellIndex > 0
            ? sortedCellsToCopy[currentCellIndex - 1].urlId
            : null,
        imageUrl: currentCell.imageUrl,
      });

      if (cache) {
        cache.cells[newCellUrlId] = cell;
      }

      cells[newCellUrlId] = cell;
    }

    comic = createNewComic({
      initialCellUrlId: newComicInitialCellUrlId,
      urlId: comicUrlId,
    });
  } else {
    const initialCellUrlId = sortedCellsToCopy[0].urlId;
    let previousCellUrlId: CellFromClientCache["previousCellUrlId"] = null;

    sortedCellsToCopy.forEach((cell) => {
      const initializedCell = getInitializedCell({
        comicUrlId,
        urlId: cell.urlId,
        studioState: cell.studioState,
        previousCellUrlId,
        imageUrl: cell.imageUrl,
      });

      if (cache) {
        cache.cells[cell.urlId] = initializedCell;
      }
      cells[cell.urlId] = initializedCell;

      previousCellUrlId = cell.urlId;
    });

    comic = createNewComic({ initialCellUrlId, urlId: comicUrlId });
  }

  if (cache) {
    cache.comics[comicUrlId] = comic;
    setCache(cache);
  }

  return {
    ...comic,
    cells,
  };
};

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
