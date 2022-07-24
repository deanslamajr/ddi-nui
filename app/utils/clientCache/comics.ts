import { ComicLegacy } from "~/data/external/comics";

import { getCellsByComicUrlId } from "./cells";

import type {
  ClientCache,
  CellFromClientCache,
  ComicFromClientCache,
} from "./";
import { getCache } from "./";

const COMICS_CACHE_KEY = "comics"; // needs to be backwards compatible with v1 cache

export const doesComicUrlIdExist = (comicUrlId: string) => {
  const comicsFromCache = getComicsCache();

  console.log("comicsFromCache", comicsFromCache);
  if (!comicsFromCache) {
    return false;
  }
  return Object.keys(comicsFromCache).includes(comicUrlId);
};

export const getComic = (comicUrlId: string): ComicFromClientCache | null => {
  const cachedComics = getComicsCache();

  if (!cachedComics) {
    return null;
  }

  return cachedComics[comicUrlId];
};

export const getComicsCache = (): ClientCache["comics"] | undefined => {
  const cache = getCache();
  cache(COMICS_CACHE_KEY, "taco");
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

// comicFromApi (v4) = {
//   cells: [
//     {
//       urlId: "Q4stQsMvHu",
//       imageUrl: "Z7OV_dklyB.png",
//       caption: "",
//       order: null,
//       previousCellUrlId: null
//       schemaVersion: 4,
//       studioState: {}
//     }
//   ],
//   initialCellUrlId: "Q4stQsMvHu",
//   isActive: true,
//   title: "",
//   urlId: "knwg8fySZ",
//   userCanEdit: true
// }
export const createComicFromPublishedComic = ({
  cells: cellsToCopy,
  initialCellUrlId,
  title,
  urlId: comicUrlId,
}: ComicLegacy) => {
  // let cache = getCache();

  // if (!cache) {
  //   cache = getInitializedCache();
  // }
  // if (!cache.cells) {
  //   cache.cells = {};
  // }
  // if (!cache.comics) {
  //   cache.comics = {};
  // }

  if (
    cellsToCopy.length > 0 &&
    cellsToCopy[0].schemaVersion &&
    cellsToCopy[0].schemaVersion >= 4
  ) {
    // create cells
    cellsToCopy.forEach((cell) => {
      cache.cells[cell.urlId] = getInitializedCell({
        comicUrlId,
        urlId: cell.urlId,
        studioState: cell.studioState,
        previousCellUrlId: cell.previousCellUrlId,
        imageUrl: cell.imageUrl,
      });
    });

    const comic = createNewComic();
    comic.urlId = comicUrlId;
    comic.initialCellUrlId = initialCellUrlId;
    cache.comics[comicUrlId] = comic;
  } else {
    const sortedCells = cellsToCopy.sort(sortByOrder);
    // cell (v3): {
    //   caption: ""
    //   imageUrl: "iSe-T7oDa.png"
    //   order: 2
    //   previousCellId: null
    //   schemaVersion: 3
    //   studioState: {activeEmojiId: 3, backgroundColor: "#19194d", currentEmojiId: 6, showEmojiPicker: false, title: "", …}
    //   urlId: "4vR8TtVLb"
    // }

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

    const comic = createNewComic();
    comic.urlId = comicUrlId;
    comic.initialCellUrlId = sortedCells[0].urlId;
    cache.comics[comicUrlId] = comic;
  }

  setCache(cache);

  const comic = getComic(comicUrlId);
  const cells = getCellsByComicUrlId(comicUrlId);

  return {
    ...comic,
    cells,
  };
};
