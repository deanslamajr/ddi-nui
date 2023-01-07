import { ComicFromGetComicApi } from "~/interfaces/comic";
import { sortCellsFromGetComic } from "~/utils/sortCells";

import { ClientCache, generateDraftUrlId, getCache, setCache } from "./index";
import {
  CellFromClientCache,
  deleteCell,
  getCellsByComicUrlId,
  getNewCell,
} from "./cell";

export type ComicFromClientCache = {
  initialCellUrlId: string | null;
  lastModified: number;
  urlId: string;
};

export type HydratedComic = ComicFromClientCache & {
  cells: Record<string, CellFromClientCache> | null;
};

/*******************
 ***********
 * SELECTORS
 */

export const getComics = (): Record<string, ComicFromClientCache> => {
  return getCache().comics;
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

export const getComic = (comicUrlId: string, cache?: ClientCache) => {
  const localCache = cache || getCache();

  if (!localCache.comics || !localCache.comics[comicUrlId]) {
    return null;
  }

  return localCache.comics[comicUrlId];
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

/*******************
 ***********
 * UPDATES
 */

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

      const cell = getNewCell({
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
      const initializedCell = getNewCell({
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

export const createNewComic = (
  template?: Partial<ComicFromClientCache>
): ComicFromClientCache => {
  return {
    initialCellUrlId: template?.initialCellUrlId || null,
    lastModified: Date.now(),
    urlId: template?.urlId || generateDraftUrlId(),
  };
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
