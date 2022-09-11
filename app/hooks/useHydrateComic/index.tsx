import { useEffect, useState } from "react";

import {
  copyComicFromPublishedComic,
  createComicFromPublishedComic,
  doesComicUrlIdExist,
  hydrateComicFromClientCache,
  HydratedComic,
} from "~/utils/clientCache";
import { generateCellImage } from "~/utils/generateCellImageFromEmojis";
import { DDI_APP_PAGES } from "~/utils/urls";

import { get as getComicFromNetwork } from "~/data/external/getComics";

const hydrateComicFromNetwork = async (
  comicUrlId: string
): Promise<HydratedComic | null> => {
  let comicFromNetwork = await getComicFromNetwork(comicUrlId);

  if (!comicFromNetwork) {
    console.error(`Comic not found. comicUrlId:${comicUrlId}`);
    return null;
  } else if (!comicFromNetwork.isActive) {
    console.error(
      `Comic cannot be edited as it is not active. comicUrlId:${comicUrlId}`
    );
    return null;
  } else if (!comicFromNetwork.userCanEdit) {
    return Promise.resolve(copyComicFromPublishedComic(comicFromNetwork));
  } else {
    return Promise.resolve(createComicFromPublishedComic(comicFromNetwork));
  }
};

const hydrateComic = async (
  comicUrlId: string
): Promise<HydratedComic | null> => {
  let hydratedComic: HydratedComic | null = null;

  // try to fetch from client cache
  // if exists in client cache
  if (doesComicUrlIdExist(comicUrlId)) {
    // hydrate the cells and comic from client cache and return formatted data
    hydratedComic = hydrateComicFromClientCache(comicUrlId);
  } else {
    hydratedComic = await hydrateComicFromNetwork(comicUrlId);
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
}: {
  comicUrlId: string;
  onError: () => void;
}): {
  comic: HydratedComic | null;
  isHydrating: boolean;
} => {
  const [isHydrating, setIsHydrating] = useState(true);
  const [comic, setComic] = useState<HydratedComic | null>(null);

  useEffect(() => {
    if (!isHydrating) {
      setIsHydrating(true);
    }

    hydrateComic(comicUrlId)
      .then((hydratedComic) => {
        if (!hydratedComic) {
          // this.props.showSpinner()
          return location.replace(DDI_APP_PAGES.cellStudio());
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
  }, [comicUrlId]);

  return { comic, isHydrating };
};

export default useHydrateComic;
