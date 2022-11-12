import {
  HydratedComic,
  copyComicFromPublishedComic,
  createComicFromPublishedComic,
} from "~/utils/clientCache";

import { get as getComicFromNetwork } from "~/data/external/getComics";

export const hydrateFromNetwork = async (
  comicUrlId: string,
  shouldUpdateCache?: boolean
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
    return Promise.resolve(
      copyComicFromPublishedComic(comicFromNetwork, shouldUpdateCache)
    );
  } else {
    return Promise.resolve(
      createComicFromPublishedComic({
        comicFromGetApi: comicFromNetwork,
        shouldUpdateCache,
      })
    );
  }
};
