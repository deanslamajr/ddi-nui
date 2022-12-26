import { useEffect, useState } from "react";

import {
  doesComicUrlIdExist,
  hydrateComicFromClientCache,
  HydratedComic,
} from "~/utils/clientCache";
import { generateCellImage } from "~/utils/generateCellImageFromEmojis";
import { sortCellsV4 } from "~/utils/sortCells";

import { hydrateFromNetwork as hydrateComicFromNetwork } from "~/data/client/comic";

const hydrateComic = async (
  comicUrlId: string,
  shouldUpdateCache?: boolean
): Promise<HydratedComic | null> => {
  let hydratedComic: HydratedComic | null = null;

  // try to fetch from client cache
  // if exists in client cache
  if (doesComicUrlIdExist(comicUrlId)) {
    // hydrate the cells and comic from client cache and return formatted data
    hydratedComic = hydrateComicFromClientCache(comicUrlId);
    const unsortedCells = Object.values(hydratedComic.cells || {});
    const sortedCellsArray = sortCellsV4(
      unsortedCells,
      hydratedComic.initialCellUrlId
    );
    const sortedCells = sortedCellsArray.reduce((acc, cell) => {
      return {
        ...acc,
        [cell.urlId]: cell,
      };
    }, {});
    hydratedComic.cells = sortedCells;
  } else {
    hydratedComic = await hydrateComicFromNetwork(
      comicUrlId,
      shouldUpdateCache
    );
  }

  if (!hydratedComic) {
    return null;
  }

  // generate images for any unpublished cell
  const cells = Object.values(hydratedComic.cells || {});
  const cellsWithUnpublishedImages = cells.filter((cell) => cell.hasNewImage);
  await Promise.all(
    cellsWithUnpublishedImages.map((cellFromClientCache) =>
      generateCellImage(cellFromClientCache)
    )
  );

  return hydratedComic;
};

const useHydrateComic = ({
  comicUrlId,
  onError,
  shouldUpdateCache = true,
  useEffectKey = "",
}: {
  comicUrlId: string;
  onError: () => void;
  shouldUpdateCache?: boolean;
  useEffectKey?: string;
}): {
  comic: HydratedComic | null;
  isHydrating: boolean;
} => {
  const [isHydrating, setIsHydrating] = useState(true);
  const [comic, setComic] = useState<HydratedComic | null>(null);

  useEffect(() => {
    setIsHydrating(true);

    hydrateComic(comicUrlId, shouldUpdateCache)
      .then((hydratedComic) => {
        if (!hydratedComic) {
          return null;
        }
        setComic(hydratedComic);
      })
      .catch((error) => {
        // TODO - improve logging
        console.error(error);
        return onError();
      })
      .finally(() => {
        setIsHydrating(false);
      });
  }, [comicUrlId, setIsHydrating, useEffectKey]);

  return { comic, isHydrating };
};

export default useHydrateComic;
