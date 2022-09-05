import { useEffect, useState } from "react";

import {
  CellFromClientCache,
  doesComicUrlIdExist as doesComicExistInCache,
  hydrateComicFromClientCache,
  HydratedComic,
} from "~/utils/clientCache";
import { generateCellImage } from "~/utils/generateCellImageFromEmojis";
import { sortCellsV4 } from "~/utils/sortCells";

import {
  ComicFromLegacyGetComicApi,
  get as getComicFromNetwork,
} from "~/data/external/comics";

const convertComic = (comic: ComicFromLegacyGetComicApi): HydratedComic => {
  const sortedCells = sortCellsV4(comic.cells, comic.initialCellUrlId);

  let previousCellUrlId: string | null = null;
  const cells: Record<string, CellFromClientCache> = sortedCells.reduce(
    (convertedCells, cell) => {
      const latestCell = {
        urlId: cell.urlId,
        imageUrl: cell.imageUrl,
        comicUrlId: comic.urlId,
        previousCellUrlId,
        schemaVersion: cell.schemaVersion,
        studioState: cell.studioState,
      };

      previousCellUrlId = latestCell.urlId;

      return {
        ...convertedCells,
        [cell.urlId]: latestCell,
      };
    },
    {} as Record<string, CellFromClientCache>
  );
  return {
    cells,
    initialCellUrlId: comic.initialCellUrlId,
  };
};

const hydrateComic = async (
  comicUrlId: string
): Promise<HydratedComic | null> => {
  let hydratedComic: HydratedComic | null = null;

  // try to fetch from client cache
  // if exists in client cache
  if (doesComicExistInCache(comicUrlId)) {
    // hydrate the cells and comic from client cache and return formatted data
    hydratedComic = hydrateComicFromClientCache(comicUrlId);

    // generate images for any unpublished cell
    const cells = Object.values(hydratedComic.cells || {});
    const cellsWithUnpublishedImages = cells.filter((cell) => cell.hasNewImage);
    await Promise.all(
      cellsWithUnpublishedImages.map((cellFromClientCache) =>
        generateCellImage(cellFromClientCache)
      )
    );
  } else {
    const comicFromNetwork = await getComicFromNetwork(comicUrlId);

    if (comicFromNetwork) {
      hydratedComic = convertComic(comicFromNetwork);
    }
  }

  return hydratedComic;
};

const useComic = ({
  comicUrlId,
}: {
  comicUrlId: string;
}): HydratedComic | null => {
  const [comic, setComic] = useState<HydratedComic | null>(null);

  useEffect(() => {
    hydrateComic(comicUrlId)
      .then((hydratedComic) => {
        setComic(hydratedComic);
      })
      .catch((error) => {
        // TODO - improve logging
        console.error(error);
        setComic(null);
      });
  }, [comicUrlId]);

  return comic;
};

export default useComic;
