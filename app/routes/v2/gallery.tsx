import type { LinksFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";

import CreateNavButton, {
  links as createNavButtonStylesUrl,
} from "~/components/CreateNavButton";
import Header, { links as headerStylesUrl } from "~/components/Header";
import Gallery, { links as galleryStylesUrls } from "~/components/Gallery";
import GallerySearchModal, {
  GallerySearchNavButton,
  links as searchModalStylesUrls,
} from "~/components/GallerySearch";

import stylesUrl from "~/styles/routes/v2/gallery.css";

import { LoaderData } from "~/loaders/gallery";
export { default as loader } from "~/loaders/gallery";

export const links: LinksFunction = () => {
  return [
    ...searchModalStylesUrls(),
    ...createNavButtonStylesUrl(),
    ...headerStylesUrl(),
    ...galleryStylesUrls(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  console.log("gallery comics from loader:", data);

  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? "?" + searchParams.toString()
    : "";

  return (
    <>
      <div className="gallery-outer-container">
        <Header text="draw draw ink" />
        <Gallery
          data={data}
          generateComicLink={(comicUrlId) =>
            `${DDI_APP_PAGES.comic(comicUrlId)}${queryString}`
          }
          urlPathForGalleryData={DDI_APP_PAGES.gallery()}
        />
      </div>
      <CreateNavButton />
      <GallerySearchNavButton />
      <GallerySearchModal />
      <Outlet />
    </>
  );
}
