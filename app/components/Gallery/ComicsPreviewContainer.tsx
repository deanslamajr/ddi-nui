import { FC, useCallback, useEffect, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import classNames from "classnames";

import { ComicFromGalleryQueries } from "~/interfaces/comic";

import ShowMore from "~/components/ShowMore";
import NewComicsExistButton, {
  links as newComicsExistStylesUrl,
} from "~/components/NewComicsExistButton";

import ComicPreview, { links as comicPreviewStylesUrl } from "./ComicPreview";

import stylesUrl from "~/styles/components/Gallery.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    ...newComicsExistStylesUrl(),
    ...comicPreviewStylesUrl(),
  ];
};

const ComicsPreviewContainer: FC<{
  comics: ComicFromGalleryQueries[];
  isInitializingData: boolean;
  isNewComicsExistVisible: boolean;
  isShowMoreNewerVisible: boolean;
  isShowMoreOlderVisible: boolean;
  generateComicLink: (comicUrlId: string) => string;
  newerCursor: string | null;
  olderCursor: string | null;
  shouldCollapseHeader?: boolean;
  urlPathForGalleryData?: string;
}> = ({
  comics,
  isInitializingData,
  isNewComicsExistVisible,
  isShowMoreNewerVisible,
  isShowMoreOlderVisible,
  generateComicLink,
  newerCursor,
  olderCursor,
  shouldCollapseHeader,
  urlPathForGalleryData,
}) => {
  const [width, setWidth] = useState<number>(0);
  const [urlIdToScrollTo, setUrlIdToScrollTo] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      setWidth(newWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const saveScrollPosition = useCallback(() => {
    if (comics.length > 0) {
      const initialComic = comics[0];
      setUrlIdToScrollTo(initialComic.urlId);
    }
  }, [comics.length]);

  useEffect(() => {
    if (urlIdToScrollTo) {
      const comicPreviewToScrollTo = document.getElementById(urlIdToScrollTo);
      if (comicPreviewToScrollTo) {
        setTimeout(() => {
          comicPreviewToScrollTo.scrollIntoView();
          // add a little hint that comics were added above
          window.scrollBy(0, -50);

          // prevent subsequent "show older" actions from scrolling to the top of page
          setUrlIdToScrollTo(null);
        }, 100);
      }
    }
  }, [setUrlIdToScrollTo, urlIdToScrollTo, comics.length]);

  return isInitializingData ? (
    <div className="initializing-spinner-container">
      <div className="nav-button loading large-icon">🤙</div>
    </div>
  ) : (
    <>
      {(!shouldCollapseHeader ||
        (shouldCollapseHeader &&
          (isShowMoreNewerVisible || isNewComicsExistVisible))) && (
        <div className="top-button-container">
          <ShowMore
            isVisible={isShowMoreNewerVisible}
            isNewer
            offset={newerCursor}
            onClick={saveScrollPosition}
            urlPathForGalleryData={urlPathForGalleryData}
          />
          <NewComicsExistButton isVisible={isNewComicsExistVisible} />
        </div>
      )}

      {/* key on width to trigger a rerender of children
            when resize event occurs */}
      <div
        key={width}
        className={classNames("comics-container", {
          "no-results": comics.length === 0,
        })}
      >
        {comics.length > 0 ? (
          comics.map(({ cellsCount, initialCell, urlId }) => (
            <ComicPreview
              key={urlId}
              cellsCount={cellsCount}
              initialCell={initialCell}
              generateComicLink={generateComicLink}
              urlId={urlId}
            />
          ))
        ) : (
          <Link
            to="."
            replace={true}
            state={{ scroll: false }}
            className="nav-button reset-search-button"
          >
            <button>🔝</button>
          </Link>
        )}
      </div>

      <ShowMore
        isVisible={isShowMoreOlderVisible}
        offset={olderCursor}
        urlPathForGalleryData={urlPathForGalleryData}
      />
    </>
  );
};

export default ComicsPreviewContainer;
