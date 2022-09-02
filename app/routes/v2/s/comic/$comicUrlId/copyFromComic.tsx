import type { LinksFunction } from "remix";
import { useLoaderData } from "remix";
import { Outlet, useParams, useNavigate } from "@remix-run/react";

import Modal, { links as modalStylesUrl } from "~/components/Modal";
import Gallery, { links as galleryStylesUrl } from "~/components/Gallery";

import { DDI_APP_PAGES } from "~/utils/urls";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.css";

import { LoaderData } from "~/loaders/gallery";
export { default as loader } from "~/loaders/gallery";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...galleryStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export default function IndexRoute() {
  const params = useParams();
  const comicUrlId = params.comicUrlId!;

  const navigate = useNavigate();

  const data = useLoaderData<LoaderData>();

  const returnToParent = () => {
    navigate("..");
  };

  return (
    <>
      <Modal onCancelClick={returnToParent} className="within-modal">
        <Gallery
          data={data}
          generateComicLink={(comicToCopyUrlId) =>
            DDI_APP_PAGES.comicStudioCopyFromComicCell(
              comicUrlId,
              comicToCopyUrlId
            )
          }
          shouldCollapseHeader
          shouldPollForUpdates={false}
          useRemixLinks
        />
      </Modal>
      <Outlet />
    </>
  );
}
