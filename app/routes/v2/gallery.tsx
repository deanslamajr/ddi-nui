import type { LinksFunction } from "remix";
import { useLoaderData } from "remix";

import { DDI_APP_PAGES } from "~/utils/urls";

import CreateNavButton, {
  links as createNavButtonStylesUrl,
} from "~/components/CreateNavButton";
import Header, { links as headerStylesUrl } from "~/components/Header";
import Gallery, { links as galleryStylesUrls } from "~/components/Gallery";

import stylesUrl from "~/styles/routes/v2/gallery.css";

import { LoaderData } from "~/loaders/gallery";
export { default as loader } from "~/loaders/gallery";

export const links: LinksFunction = () => {
  return [
    ...createNavButtonStylesUrl(),
    ...headerStylesUrl(),
    ...galleryStylesUrls(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="gallery-outer-container">
      <Header text="draw draw ink" />
      <Gallery
        data={data}
        generateComicLink={(comicUrlId) => DDI_APP_PAGES.comic(comicUrlId)}
        urlPathForGalleryData={DDI_APP_PAGES.gallery()}
      />

      <CreateNavButton />
    </div>
  );
}
