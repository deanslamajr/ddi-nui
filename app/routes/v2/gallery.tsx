import type { LinksFunction } from "remix";
import { useLoaderData } from "remix";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { usePageVisibility } from "react-page-visibility";
useRef;
import ShowMore, { links as showMoreStylesUrls } from "~/components/ShowMore";
import NewComicsExistButton, {
  links as newComicsExistStylesUrl,
} from "~/components/NewComicsExistButton";
import CreateNavButton, {
  links as createNavButtonStylesUrl,
} from "~/components/CreateNavButton";
import CellsThumb, {
  links as cellsThumbStylesUrl,
} from "~/components/CellsThumb";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import Logo, { links as logoStylesUrl } from "~/components/Logo";

import { DDI_API_ENDPOINTS, DDI_APP_PAGES } from "~/utils/urls";
import sortComics from "~/utils/sortComics";

import { getLatestTimestamp, setLatestTimestamp } from "~/frontend/clientCache";

import { Comic } from "~/interfaces/comic";

import stylesUrl from "~/styles/routes/gallery.css";

import { LoaderData } from "~/loaders/gallery";
export { default as loader } from "~/loaders/gallery";

export const links: LinksFunction = () => {
  return [
    ...showMoreStylesUrls(),
    ...cellsThumbStylesUrl(),
    ...createNavButtonStylesUrl(),
    ...unstyledLinkStylesUrl(),
    ...logoStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    ...newComicsExistStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

type ComicPreviewProps = {
  cellsCount: number;
  initialCell: Comic["initialCell"];
  urlId: string;
};

const ComicPreview: FC<ComicPreviewProps> = ({
  cellsCount,
  initialCell,
  urlId,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <UnstyledLink
      id={urlId}
      href={DDI_APP_PAGES.getComicPageUrl(urlId)}
      onclick={() => setIsClicked(true)}
    >
      {isClicked ? (
        <CellWithLoadSpinner />
      ) : (
        <CellsThumb cell={initialCell} cellsCount={cellsCount} />
      )}
    </UnstyledLink>
  );
};

type ComicsPreviewContainerProps = {
  comics: Comic[];
  isNewComicsExistVisible: boolean;
  isShowMoreNewerVisible: boolean;
  isShowMoreOlderVisible: boolean;
  newerCursor: string | null;
  olderCursor: string | null;
};

const ComicsPreviewContainer: FC<ComicsPreviewContainerProps> = ({
  comics,
  isNewComicsExistVisible,
  isShowMoreNewerVisible,
  isShowMoreOlderVisible,
  newerCursor,
  olderCursor,
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

  return (
    <>
      <div className="top-button-container">
        <ShowMore
          isVisible={isShowMoreNewerVisible}
          isNewer
          offset={newerCursor}
          onClick={saveScrollPosition}
        />
        <NewComicsExistButton isVisible={isNewComicsExistVisible} />
      </div>
      {/* key on width to trigger a rerender of children
    when resize event occurs */}
      <div key={width} className="comics-container">
        {comics.map(({ cellsCount, initialCell, urlId }) => (
          <ComicPreview
            key={urlId}
            cellsCount={cellsCount}
            initialCell={initialCell}
            urlId={urlId}
          />
        ))}
      </div>

      <ShowMore isVisible={isShowMoreOlderVisible} offset={olderCursor} />
    </>
  );
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  const [comics, setComics] = useState<Comic[]>(
    data.older?.comics || data.newer?.comics || []
  );

  const [olderCursor, setOlderCursor] = useState<string | null>(
    comics.length > 0 ? comics[comics.length - 1].updatedAt : null
  );
  const [newerCursor, setNewerCursor] = useState<string | null>(
    comics.length > 0 ? comics[0].updatedAt : null
  );
  const [hasMoreOlderComics, setHasMoreOlderComics] = useState<boolean>(
    data.older?.hasMore
  );
  const [hasMoreNewerComics, setHasMoreNewerComics] = useState<boolean>(
    data.hasCursor && // don't want to show the showMoreNewer button on root page loads that don't have querystrings
      data.newer?.hasMore
  );

  const [showNewComicsExistButton, setShowNewComicsExistButton] =
    useState<boolean>(false);

  const isVisible = usePageVisibility();

  useEffect(() => {
    const olderComics = data.older?.comics;
    const newerComics = data.newer?.comics;

    let allComics: Comic[] | null = null;

    // Handle older comics
    if (olderComics) {
      const latestOlderCursor = data.older.cursor;

      if (latestOlderCursor !== olderCursor && olderComics.length) {
        allComics = [...comics, ...olderComics];
      }
      setHasMoreOlderComics(data.older.hasMore);
    } else {
      // Handle newer comics
      const latestNewerCursor = data.newer.cursor;

      if (
        newerComics &&
        latestNewerCursor !== newerCursor &&
        newerComics.length
      ) {
        allComics = [...newerComics, ...comics];
      }
      setHasMoreNewerComics(data.newer.hasMore);
    }

    if (allComics !== null) {
      const sortedComics = sortComics(allComics);

      const latestNewerCursor = sortedComics[0].updatedAt;
      const latestOlderCursor = sortedComics[sortedComics.length - 1].updatedAt;

      setComics(sortedComics);

      if (latestNewerCursor !== newerCursor) {
        setNewerCursor(latestNewerCursor);
      }
      if (latestOlderCursor !== olderCursor) {
        setOlderCursor(latestOlderCursor);
      }
    }
  }, [comics, setComics, data]);

  useEffect(() => {
    const latestTimestamp = getLatestTimestamp();

    if (
      latestTimestamp === null ||
      !data.hasCursor ||
      // OR the latest comic loaded in the gallery
      // is newer than the cached timestamp
      // Therefore, need to update the timestamp so the "there is newer" notification is accurate
      (typeof data.newer.cursor === "string" &&
        latestTimestamp < new Date(data.newer.cursor).getTime())
    ) {
      setLatestTimestamp(new Date(data.newer.cursor!).getTime());
    }
  }, []);

  useEffect(() => {
    const latestComicsPolling = setInterval(async () => {
      // only do this if the browser tab is active
      if (!isVisible) {
        return;
      }

      const latestTimestamp = getLatestTimestamp();
      if (latestTimestamp === null) {
        // TODO better logging
        console.error(
          "Cant ping for latest comics: latest timestamp does not exist in client cache"
        );
      } else {
        const response: Response = await fetch(
          DDI_API_ENDPOINTS.getPreviousComics(`${latestTimestamp}`)
        );
        if (response.ok) {
          const getNewerComicsResponse = await response.json();
          if (getNewerComicsResponse?.comics?.length > 0) {
            setShowNewComicsExistButton(true);
          }
        }
      }
    }, 5000);
    return () => clearInterval(latestComicsPolling);
  }, [isVisible]);

  return (
    <div className="gallery-outer-container">
      <Logo />
      <ComicsPreviewContainer
        comics={comics}
        isNewComicsExistVisible={showNewComicsExistButton}
        isShowMoreNewerVisible={data.hasCursor && hasMoreNewerComics}
        isShowMoreOlderVisible={hasMoreOlderComics}
        newerCursor={newerCursor}
        olderCursor={olderCursor}
      />

      <CreateNavButton />
    </div>
  );
}
