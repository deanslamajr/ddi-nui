import newrelic from "newrelic";
import type { LinksFunction, LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
// import { useTransition } from "@remix-run/react";
import { FC, useEffect, useState } from "react";
import { usePageVisibility } from "react-page-visibility";

import ShowMore, {
  links as showMoreStylesUrls,
  OLDER_OFFSET_QUERYSTRING,
  NEWER_OFFSET_QUERYSTRING,
} from "~/components/ShowMore";
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

import { getLatestTimestamp, setLatestTimestamp } from "~/frontend/clientCache";

import stylesUrl from "~/styles/gallery.css";

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

type Comic = {
  cellsCount: number;
  initialCell: {
    caption: string;
    imageUrl: string;
    order: number | null;
    schemaVersion: number;
    urlId: string;
  };
  updatedAt: string;
  urlId: string;
};

type ComicsPagination = {
  cursor: string | null;
  comics?: Array<Comic>;
  hasMore: boolean;
};

type LoaderData = {
  hasCursor: boolean;
  older: ComicsPagination;
  newer: ComicsPagination;
};

const sortComics = (comics: Comic[]): Comic[] => {
  const comicUrlIdsForFilteringDuplicates: string[] = [];
  return comics
    .slice() // to avoid mutating the array from the next line's in-place sort
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .filter((comic) => {
      if (!comicUrlIdsForFilteringDuplicates.includes(comic.urlId)) {
        comicUrlIdsForFilteringDuplicates.push(comic.urlId);
        return true;
      }
      return false;
    });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  return new Promise<Response>((resolve, reject) => {
    newrelic.startWebTransaction(path, async () => {
      const olderOffset = url.searchParams.getAll(OLDER_OFFSET_QUERYSTRING)[0];
      const newerOffset = url.searchParams.getAll(NEWER_OFFSET_QUERYSTRING)[0];

      const hasCursor = Boolean(olderOffset || newerOffset);

      let errorAttributes: Record<string, string> = {};

      // This data request is asking for
      if (newerOffset) {
        let getNewerComicsResponse: {
          comics: Comic[];
          hasMoreNewer: boolean;
        } | null = null;

        try {
          const response: Response = await fetch(
            DDI_API_ENDPOINTS.getPreviousComics(newerOffset)
          );

          if (!response.ok) {
            errorAttributes = {
              statusCode: response.status.toString(),
              url: response.url,
              statusText: response.statusText,
            };
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          getNewerComicsResponse = await response.json();
        } catch (error: any) {
          // TODO better logging
          console.error(error);
          newrelic.noticeError(error, {
            action: "getPreviousComics",
            newerOffset,
            ...errorAttributes,
          });
        }

        const comics: Comic[] = getNewerComicsResponse?.comics || [];
        const hasComics = comics.length > 0;
        const sortedComics = sortComics(comics);

        return resolve(
          json({
            hasCursor,
            newer: {
              comics: sortedComics,
              hasMore: getNewerComicsResponse?.hasMoreNewer || false,
              cursor: hasComics ? sortedComics[0].updatedAt : null,
            },
            // will only use this data on page load requests
            // to initialize the component state
            older: {
              hasMore: true,
              cursor: hasComics
                ? sortedComics[sortedComics.length - 1].updatedAt
                : null,
            },
          })
        );
      }

      let getComicsResponse: {
        comics: Comic[];
        cursor: string;
        hasMoreOlder: boolean;
      } | null = null;

      try {
        const response: Response = await fetch(
          DDI_API_ENDPOINTS.getComics(olderOffset)
        );

        if (!response.ok) {
          errorAttributes = {
            statusCode: response.status.toString(),
            url: response.url,
            statusText: response.statusText,
          };
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        getComicsResponse = await response.json();
      } catch (error: any) {
        // TODO better logging
        console.error(error);
        newrelic.noticeError(error, {
          action: "getComics",
          olderOffset,
          ...errorAttributes,
        });
      }

      let earliestComicUpdatedAt;
      const comics: Comic[] = getComicsResponse?.comics || [];
      if (comics.length > 0) {
        const earliestComic = comics[0];
        earliestComicUpdatedAt = earliestComic.updatedAt;
      }

      return resolve(
        json({
          hasCursor,
          older: {
            comics,
            hasMore: getComicsResponse?.hasMoreOlder || false,
            cursor: getComicsResponse?.cursor || null,
          },
          // will only use this data on page load requests
          // to initialize the component state
          newer: {
            cursor: earliestComicUpdatedAt || null,
            hasMore: true,
          },
        })
      );
    });
  });
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

const ComicsPreviewContainer: FC<{ comics: Comic[] }> = ({ comics }) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      setWidth(newWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // key on width to trigger a rerender of children
    // when resize event occurs
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
    data.older?.hasMore || true
  );
  const [hasMoreNewerComics, setHasMoreNewerComics] = useState<boolean>(
    data.newer?.hasMore || true
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

    if (latestTimestamp === null || !data.hasCursor) {
      const now = Date.now();
      setLatestTimestamp(now);
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

      {/* <ShowMore isVisible={hasMoreNewerComics} isNewer offset={newerCursor} /> */}
      <ComicsPreviewContainer comics={comics} />
      {/* <ShowMore isVisible={hasMoreOlderComics} offset={olderCursor} /> */}

      <NewComicsExistButton isVisible={showNewComicsExistButton} />

      <CreateNavButton />
    </div>
  );
}
