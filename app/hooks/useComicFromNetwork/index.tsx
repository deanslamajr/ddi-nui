import { useEffect, useState } from "react";

import { CellFromClientCache, HydratedComic } from "~/utils/clientCache";
import { sortCellsV4 } from "~/utils/sortCells";

import {
  ComicLegacy,
  get as getComicFromNetwork,
} from "~/data/external/comics";

const convertComic = (comic: ComicLegacy): HydratedComic => {
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

const useComicFromNetwork = ({
  comicUrlId,
}: {
  comicUrlId: string;
}): HydratedComic | null => {
  const [comic, setComic] = useState<HydratedComic | null>(null);

  useEffect(() => {
    try {
      getComicFromNetwork(comicUrlId).then((comicFromNetwork) => {
        if (comicFromNetwork) {
          const convertedComic = convertComic(comicFromNetwork);
          setComic(convertedComic);
        }
      });
    } catch (error) {
      // TODO better logging
      console.error(error);
      setComic(null);
    }
  }, [comicUrlId]);

  return comic;
};

export default useComicFromNetwork;
