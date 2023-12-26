import { useEffect, useState } from "react";

import { hydrateComicFromClientCache } from "~/utils/clientCache";
import { HydratedComic } from "~/utils/clientCache/comic";
import { doesComicUrlIdExist as doesComicExistInClientCache } from "~/utils/clientCache/comic";
import { sortCellsV4 } from "~/utils/sortCells";

import { hydrateFromNetwork as hydrateComicFromNetwork } from "~/data/client/comic";

const hydrateComic = async (
  comicUrlId: string,
  shouldUpdateCache?: boolean,
  isDebugProdCell?: boolean
): Promise<HydratedComic | null> => {
  let hydratedComic: HydratedComic | null = null;

  // try to fetch from client cache
  // if exists in client cache
  if (comicUrlId === "new" || doesComicExistInClientCache(comicUrlId)) {
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
      shouldUpdateCache,
      isDebugProdCell
    );
  }

  if (!hydratedComic) {
    return null;
  }

  return hydratedComic;
};

const useHydrateComic = ({
  comicUrlId,
  onError,
  shouldUpdateCache = true,
  isDebugProdCell,
}: {
  comicUrlId: string;
  onError: () => void;
  shouldUpdateCache?: boolean;
  isDebugProdCell?: boolean;
}): {
  comic: HydratedComic | null;
  isHydrating: boolean;
} => {
  const [isHydrating, setIsHydrating] = useState(true);
  const [comic, setComic] = useState<HydratedComic | null>(null);

  useEffect(() => {
    setIsHydrating(true);

    hydrateComic(comicUrlId, shouldUpdateCache, isDebugProdCell)
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
  }, [comicUrlId, setIsHydrating]);

  return { comic, isHydrating };
};

export default useHydrateComic;
