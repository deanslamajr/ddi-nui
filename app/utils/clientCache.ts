import store from "store2";
import shortid from "shortid";

import { theme } from "~/utils/stylesTheme";
// import theme from "../helpers/theme";
import { sortByOrder, sortCellsV4 } from "~/utils/sortCells";
import {
  DRAFT_SUFFIX,
  SCHEMA_VERSION,
  STORAGEKEY_STUDIO,
} from "~/utils/constants";
// import { DRAFT_SUFFIX, STORAGEKEY_STUDIO } from "../config/constants.json";

import { StudioState } from "~/interfaces/studioState";

import { ComicFromLegacyGetComicApi } from "~/data/external/comics";

const getCache = (): ClientCache => {
  const cacheFromStore: ClientCache | null = store(STORAGEKEY_STUDIO);

  if (cacheFromStore !== null) {
    return cacheFromStore;
  }

  // initialize client cache
  const newClientCache = getInitializedCache();
  setCache(newClientCache);

  return newClientCache;
};

const setCache = (newCache: ClientCache) => {
  store(STORAGEKEY_STUDIO, newCache);
};

const generateDraftUrlId = () => {
  return `${shortid.generate()}${DRAFT_SUFFIX}`;
};

// CACHE SCHEMA
//
// const cache = {
//   cells: {
//     "someCellUrlId": {
//       hasNewImage: true,
//       urlId: 'someCellUrlId',
//       imageUrl: null,
//       comicUrlId: 'someComicUrlId',
//       previousCellUrlId: null,
//       studioState: {}
//     },
//     "anotherCellUrlId": {
//       hasNewImage: true,
//       urlId: 'anotherCellUrlId',
//       imageUrl: null,
//       comicUrlId: 'someComicUrlId',
//       previousCellUrlId: 'someCellUrlId,
//       studioState: {}
//     }
//   },
//   comics: {
//     "someComicUrlId": {
//       initialCellUrlId: 'someCellUrlId'
//     }
//   }
// }
export type CellFromClientCache = {
  hasNewImage?: boolean;
  urlId: string;
  imageUrl?: string | null;
  isDirty?: boolean;
  comicUrlId?: string | null;
  previousCellUrlId?: string | null;
  schemaVersion?: number | null;
  studioState?: StudioState | null;
};

export type ComicFromClientCache = {
  initialCellUrlId: string | null;
  lastModified: number;
  urlId: string;
};

export type ClientCache = {
  cells: Record<string, CellFromClientCache>;
  comics: Record<string, ComicFromClientCache>;
};

export type HydratedComic = {
  initialCellUrlId: string | null;
  cells: Record<string, CellFromClientCache> | null;
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

const getInitializedCell = ({
  comicUrlId,
  hasNewImage,
  imageUrl,
  isDirty,
  previousCellUrlId,
  studioState,
  urlId,
}: Partial<CellFromClientCache>): CellFromClientCache => {
  return {
    comicUrlId: comicUrlId || null,
    hasNewImage: hasNewImage || false,
    imageUrl: imageUrl || null,
    isDirty: isDirty || false,
    previousCellUrlId,
    schemaVersion: SCHEMA_VERSION,
    studioState: studioState || getInitializedStudioState(),
    urlId: urlId || generateDraftUrlId(),
  };
};

export const getInitializedStudioState = (): StudioState => {
  return {
    activeEmojiId: 1,
    backgroundColor: theme.colors.white,
    caption: "",
    currentEmojiId: 1,
    emojis: {},
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

  cellsAssociatedWithDeletedComic.forEach((cellUrlId) => deleteCell(cellUrlId));

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

// export const doesCellUrlIdExist = (cellUrlId) => {
//   const cache = getCache();
//   if (!cache || !cache.cells) {
//     return false;
//   }
//   return Object.keys(cache.cells).includes(cellUrlId);
// };

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

// export const setCellStudioState = (
//   cellUrlId,
//   newStudioState,
//   { setHasNewImage = true } = {}
// ) => {
//   const cache = getCache();

//   const cellToUpdate = cache.cells[cellUrlId];

//   cellToUpdate.studioState = newStudioState;
//   cellToUpdate.isDirty = true;

//   if (setHasNewImage) {
//     cellToUpdate.hasNewImage = true;
//   }

//   updateComicLastModified(cellToUpdate.comicUrlId, cache);

//   setCache(cache);
// };

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
    // comicUrlId = generateComicUrlId();
    // if (!localCache.comics) {
    //   localCache.comics = {};
    // }
    comic = createNewComic();
    localCache.comics[comic.urlId] = comic;
    // localCache.comics[comicUrlId].urlId = comicUrlId;
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

// export const getStudioState = (cellUrlId) => {
//   const cache = getCache();
//   const cellCache = cache && cache.cells ? cache.cells[cellUrlId] : null;

//   return cellCache ? cellCache.studioState : null;
// };

// export const clearStudioState = (cellUrlId, initialStudioState) => {
//   const newStudioState = initialStudioState || getInitializedStudioState();
//   setCellStudioState(cellUrlId, newStudioState);
// };

// export const getComics = () => {
//   const cache = getCache();

//   if (!cache || !cache.comics) {
//     return null;
//   }

//   return cache.comics;
// };

// export const getDirtyComics = () => {
//   const comics = getComics();

//   if (!comics) {
//     return [];
//   }

//   const dirtyComics = Object.values(comics).filter(({ urlId }) => {
//     const cells = getCellsByComicUrlId(urlId);
//     return Object.values(cells).some(({ isDirty }) => isDirty);
//   });

//   return dirtyComics;
// };

// // comicFromApi (v4) = {
// //   cells: [
// //     {
// //       urlId: "Q4stQsMvHu",
// //       imageUrl: "Z7OV_dklyB.png",
// //       caption: "",
// //       order: null,
// //       previousCellUrlId: null
// //       schemaVersion: 4,
// //       studioState: {}
// //     }
// //   ],
// //   initialCellUrlId: "Q4stQsMvHu",
// //   isActive: true,
// //   title: "",
// //   urlId: "knwg8fySZ",
// //   userCanEdit: true
// // }
export const copyComicFromPublishedComic = (
  publishedComic: ComicFromLegacyGetComicApi
): HydratedComic => createComicFromPublishedComic(publishedComic, true);

export const createComicFromPublishedComic = (
  { cells: cellsToCopy, initialCellUrlId, urlId }: ComicFromLegacyGetComicApi,
  shouldDuplicateComic?: boolean
): HydratedComic => {
  const cache = getCache();

  const comicUrlId = shouldDuplicateComic ? generateDraftUrlId() : urlId;

  if (cellsToCopy[0].schemaVersion && cellsToCopy[0].schemaVersion >= 4) {
    let comic;

    if (shouldDuplicateComic) {
      const sortedCellsToCopy = sortCellsV4(cellsToCopy, initialCellUrlId);

      let newComicInitialUrlId;
      for (
        let currentCellIndex = 0;
        currentCellIndex < sortedCellsToCopy.length;
        currentCellIndex++
      ) {
        const currentCell = sortedCellsToCopy[currentCellIndex];

        const newCellUrlId = generateDraftUrlId();
        if (currentCellIndex === 0) {
          newComicInitialUrlId = newCellUrlId;
        }

        cache.cells[newCellUrlId] = getInitializedCell({
          comicUrlId: comicUrlId,
          urlId: newCellUrlId,
          studioState: currentCell.studioState,
          previousCellUrlId:
            currentCellIndex > 0
              ? sortedCellsToCopy[currentCellIndex - 1].urlId
              : null,
          imageUrl: currentCell.imageUrl,
        });
      }

      comic = createNewComic({
        initialCellUrlId: newComicInitialUrlId,
        urlId: comicUrlId,
      });
    } else {
      cellsToCopy.forEach((cell) => {
        cache.cells[cell.urlId] = getInitializedCell({
          comicUrlId,
          urlId: cell.urlId,
          studioState: cell.studioState,
          previousCellUrlId: cell.previousCellUrlId,
          imageUrl: cell.imageUrl,
        });
      });

      comic = createNewComic({ initialCellUrlId, urlId: comicUrlId });
    }

    cache.comics[comicUrlId] = comic;
  } else {
    const sortedCells = cellsToCopy.sort(sortByOrder) as any as CellPreV4[];

    type CellPreV4 = {
      caption: string;
      imageUrl: string;
      order: number;
      previousCellId: null | string;
      schemaVersion: 1 | 2 | 3;
      studioState: {
        activeEmojiId: number;
        backgroundColor: string;
        currentEmojiId: number;
        showEmojiPicker: boolean;
        title: string;
        emojis: {};
      };
      urlId: string;
    };

    let comic;
    if (shouldDuplicateComic) {
      throw new Error("need to implement prev4 version of this!");
    } else {
      function transformStudioStateToV4(
        studioStatePreV4: CellPreV4["studioState"]
      ) {
        return {
          ...studioStatePreV4,
          caption: studioStatePreV4.title,
        };
      }

      // create cells
      for (let cur = 0; cur < sortedCells.length; cur++) {
        const currentCell = sortedCells[cur];
        const previousCell = cur > 0 ? sortedCells[cur - 1] : null;

        cache.cells[currentCell.urlId] = getInitializedCell({
          comicUrlId,
          urlId: currentCell.urlId,
          studioState: transformStudioStateToV4(currentCell.studioState),
          previousCellUrlId: previousCell ? previousCell.urlId : null,
          imageUrl: currentCell.imageUrl,
          // need to create a new image to get the imageUrl to correspond to
          // the latest schemaVersion pattern
          // e.g. schemaVersion < 3 is in a different s3 bucket and if an update bumps
          // schemaVersion to the latest, components won't know to treat imageUrl as
          // an absolute URL
          hasNewImage: true,
          isDirty: true, // set as dirty so that the next publish action will update the schema
        });
      }

      comic = createNewComic({
        initialCellUrlId: sortedCells[0].urlId,
        urlId: comicUrlId,
      });
    }

    cache.comics[comicUrlId] = comic;
  }

  setCache(cache);

  return hydrateComicFromClientCache(comicUrlId);
};

export const hydrateComicFromClientCache = (comicUrlId: string) => {
  const comic = getComic(comicUrlId) || ({} as ComicFromClientCache);
  const cells = getCellsByComicUrlId(comicUrlId);

  return {
    ...comic,
    cells,
  };
};
