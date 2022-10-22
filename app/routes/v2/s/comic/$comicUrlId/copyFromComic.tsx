import type { LinksFunction } from "@remix-run/node";
import {
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";

import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import Gallery, { links as galleryStylesUrl } from "~/components/Gallery";
import GallerySearchModal, {
  GallerySearchNavButton,
  links as searchModalStylesUrls,
} from "~/components/GallerySearch";

import { DDI_APP_PAGES } from "~/utils/urls";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.css";

import { LoaderData } from "~/loaders/gallery";
export { default as loader } from "~/loaders/gallery";

export const links: LinksFunction = () => {
  return [
    ...searchModalStylesUrls(),
    ...modalStylesUrl(),
    ...galleryStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export default function IndexRoute() {
  const params = useParams();
  const comicUrlId = params.comicUrlId!;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? "?" + searchParams.toString()
    : "";

  const data = useLoaderData<LoaderData>();

  const returnToParent = () => {
    navigate(`${DDI_APP_PAGES.comicStudio(comicUrlId)}${queryString}`, {
      state: { scroll: false },
    });
  };

  return (
    <>
      <Modal
        header={
          <>
            <GallerySearchNavButton />
            <MessageContainer>
              <></>Pick a Comic
            </MessageContainer>
          </>
        }
        onCancelClick={returnToParent}
        className="within-modal"
      >
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
          urlPathForGalleryData={DDI_APP_PAGES.comicStudioCopyFromComic(
            comicUrlId
          )}
        />
      </Modal>
      <Outlet />
      <GallerySearchModal />
    </>
  );
}
