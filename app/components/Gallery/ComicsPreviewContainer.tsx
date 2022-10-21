import { FC, useCallback, useEffect, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useSearchParams, Link } from "@remix-run/react";

import { Comic } from "~/interfaces/comic";

import SearchModal, {
  links as searchModalStylesUrls,
} from "~/components/SearchModal";
import ShowMore, {
  links as showMoreStylesUrls,
  EMOJI_FILTER_QUERYSTRING,
} from "~/components/ShowMore";
import NewComicsExistButton, {
  links as newComicsExistStylesUrl,
} from "~/components/NewComicsExistButton";

import ComicPreview, { links as comicPreviewStylesUrl } from "./ComicPreview";

import stylesUrl from "~/styles/components/Gallery.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    ...searchModalStylesUrls(),
    ...showMoreStylesUrls(),
    ...newComicsExistStylesUrl(),
    ...comicPreviewStylesUrl(),
  ];
};

const ComicsPreviewContainer: FC<{
  comics: Comic[];
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
        }, 100);
      }
    }
  }, [setUrlIdToScrollTo, urlIdToScrollTo, comics.length]);

  const [searchParams, setSearchParams] = useSearchParams();

  const onSearchEmoji = (emoji: string) => {
    setSearchParams({ [EMOJI_FILTER_QUERYSTRING]: emoji });
  };

  return (
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

      {comics.length > 0 ? (
        <>
          {/* key on width to trigger a rerender of children
            when resize event occurs */}
          <div key={width} className="comics-container">
            {comics.map(({ cellsCount, initialCell, urlId }) => (
              <ComicPreview
                key={urlId}
                cellsCount={cellsCount}
                initialCell={initialCell}
                generateComicLink={generateComicLink}
                urlId={urlId}
              />
            ))}
          </div>
        </>
      ) : (
        <Link className="nav-button top-center" to=".">
          <button>↻</button>
        </Link>
      )}

      <ShowMore
        isVisible={isShowMoreOlderVisible}
        offset={olderCursor}
        urlPathForGalleryData={urlPathForGalleryData}
      />
      <SearchModal onSearchEmoji={onSearchEmoji} />
    </>
  );
};

export default ComicsPreviewContainer;
