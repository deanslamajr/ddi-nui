import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import {
  // createComicFromPublishedComic,
  doesComicUrlIdExist,
  hydrateComicFromClientCache,
  HydratedComic,
} from "~/utils/clientCache/comics";
import { DDI_APP_PAGES } from "~/utils/urls";
import { get as getComicFromNetwork } from "~/data/external/comics";

const hydrateComicFromNetwork = async (
  comicUrlId: string
): Promise<HydratedComic> => {
  const comicFromNetwork = await getComicFromNetwork(comicUrlId);

  if (!comicFromNetwork) {
    throw new Error(`Comic not found. comicUrlId:${comicUrlId}`);
  } else if (!comicFromNetwork.userCanEdit) {
    throw new Error(
      `User is not authorized to edit comic. comicUrlId:${comicUrlId}`
    );
  } else if (!comicFromNetwork.isActive) {
    throw new Error(
      `Comic cannot be edited as it is not active. comicUrlId:${comicUrlId}`
    );
  }

  // return createComicFromPublishedComic(comicFromNetwork);
  return comicFromNetwork as HydratedComic;
};

const hydrateComic = async (
  comicUrlId: string
): Promise<HydratedComic | null> => {
  // try to fetch from client cache
  // if exists in client cache
  if (doesComicUrlIdExist(comicUrlId)) {
    // hydrate the cells and comic from client cache and return formatted data
    return hydrateComicFromClientCache(comicUrlId);
  } else {
    return hydrateComicFromNetwork(comicUrlId);
  }
};

export default function ComicStudioRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const comicUrlId = params.comicUrlId;

  useEffect(() => {
    const redirectToGallery = () => {
      navigate(DDI_APP_PAGES.getGalleryPageUrl(), { replace: true });
    };

    // redirect to gallery view if url is malformed
    // This is probably handled by remix and therefore unnecessary
    if (!comicUrlId) {
      return redirectToGallery();
    }

    hydrateComic(comicUrlId)
      .then((hydratedComic) => {
        console.log("hydratedComic", hydratedComic);

        if (!hydratedComic) {
          return redirectToGallery();
        }

        //   // generate images for any unpublished cell
        //   const cells = Object.values(hydratedComic.cells || {});
        //   const cellsWithUnpublishedImages = cells.filter(
        //     (cell) => cell.hasNewImage
        //   );
        //   await Promise.all(cellsWithUnpublishedImages.map(generateCellImage));
        //   this.setState({ comic: hydratedComic }, () => {
        //     // hide spinner and scroll to bottom of comic
        //     this.props.hideSpinner(() =>
        //       window.scrollTo(0, document.body.scrollHeight)
        //     );
        //   });
      })
      .catch((error) => {
        // TODO - improve logging
        console.error(error);
        return redirectToGallery();
      });
  }, [comicUrlId]);

  return <div>Test</div>;
}
