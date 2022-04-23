import type { LinksFunction, LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
// import { useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";

import ShowMore, {
  links as showMoreStylesUrls,
  OLDER_OFFSET_QUERYSTRING,
  NEWER_OFFSET_QUERYSTRING,
} from "~/components/ShowMore";
import CreateNavButton, {
  links as createNavButtonStylesUrl,
} from "~/components/CreateNavButton";
import CellsThumb, {
  links as cellsThumbStylesUrl,
} from "~/components/CellsThumb";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";
import Logo, { links as logoStylesUrl } from "~/components/Logo";

import { DDI_API_ENDPOINTS, DDI_APP_PAGES } from "~/utils/urls";

import stylesUrl from "~/styles/gallery.css";

export const links: LinksFunction = () => {
  return [
    ...showMoreStylesUrls(),
    ...cellsThumbStylesUrl(),
    ...createNavButtonStylesUrl(),
    ...unstyledLinkStylesUrl(),
    ...logoStylesUrl(),
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
  older: ComicsPagination;
  newer: ComicsPagination;
};

const sortComics = (comics: Comic[]): Comic[] => {
  return comics
    .slice() // to avoid mutating the array from the next line's in-place sort
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
};

const OFFSET_QUERYSTRING = "o";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  // TODO figure out a better way to do this
  // e.g. instead of relying on an implicit form submit to trigger this
  // from the client, have an imperative approach.
  const isPageLoadRequest = true;

  const offset = url.searchParams.getAll(OFFSET_QUERYSTRING)[0];
  const olderOffset = url.searchParams.getAll(OLDER_OFFSET_QUERYSTRING)[0];
  const newerOffset = url.searchParams.getAll(NEWER_OFFSET_QUERYSTRING)[0];

  // This data request is asking for
  if (newerOffset) {
    const getNewerComicsResponse = await fetch(
      DDI_API_ENDPOINTS["getPreviousComics"](newerOffset, isPageLoadRequest)
    ).then((res) => res.json());

    const comics: Comic[] = getNewerComicsResponse.comics || [];
    const hasComics = comics.length > 0;
    const sortedComics = sortComics(comics);

    return json({
      newer: {
        comics: sortedComics,
        hasMore: getNewerComicsResponse.hasMoreNewer,
        cursor: hasComics ? sortedComics[0].updatedAt : null,
      },
      // will only use this data on page load requests
      // to initialize the component state
      older: {
        hasMore: getNewerComicsResponse.hasMoreOlder,
        cursor: hasComics
          ? sortedComics[sortedComics.length - 1].updatedAt
          : null,
      },
    });
  }

  const getComicsResponse = await fetch(
    DDI_API_ENDPOINTS["getComics"](
      isPageLoadRequest,
      offset || olderOffset,
      Boolean(offset)
    )
  ).then((res) => res.json());

  let earliestComicUpdatedAt;
  if (getComicsResponse.comics.length > 0) {
    const earliestComic = getComicsResponse.comics[0];
    earliestComicUpdatedAt = earliestComic.updatedAt;
  }

  return json({
    older: {
      comics: getComicsResponse.comics,
      hasMore: getComicsResponse.hasMoreOlder,
      cursor: getComicsResponse.cursor,
    },
    // will only use this data on page load requests
    // to initialize the component state
    newer: {
      cursor: earliestComicUpdatedAt,
      hasMore: getComicsResponse.hasMoreNewer,
    },
  });
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
    data.older?.hasMore || false
  );
  const [hasMoreNewerComics, setHasMoreNewerComics] = useState<boolean>(
    data.newer?.hasMore || false
  );

  useEffect(() => {
    const olderComics = data.older?.comics;
    const newerComics = data.newer?.comics;

    let allComics: Comic[] | null = null;

    // Handle older comics
    if (olderComics) {
      const latestOlderCursor = data.older.cursor;

      if (latestOlderCursor !== olderCursor && olderComics.length) {
        allComics = [...comics, ...olderComics];
        setHasMoreOlderComics(data.older.hasMore);
      }
    } else {
      // Handle newer comics
      const latestNewerCursor = data.newer.cursor;

      if (
        newerComics &&
        latestNewerCursor !== newerCursor &&
        newerComics.length
      ) {
        allComics = [...newerComics, ...comics];
        setHasMoreNewerComics(data.newer.hasMore);
      }
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

  return (
    <div>
      <div>
        <Logo />
        <ShowMore isVisible={hasMoreNewerComics} isNewer offset={newerCursor} />
        <div className="comics-container">
          {comics.map(({ cellsCount, initialCell, urlId }) => (
            <UnstyledLink
              key={urlId}
              href={DDI_APP_PAGES.getComicPageUrl(urlId)}
            >
              <CellsThumb cell={initialCell} cellsCount={cellsCount} />
            </UnstyledLink>
          ))}
        </div>
        <ShowMore isVisible={hasMoreOlderComics} offset={olderCursor} />
      </div>

      {/* {newerComicsExist && (
        <NavButton
          value="SHOW NEWER"
          cb={this.handleRefreshClick}
          position={TOP_RIGHT}
        />
      )}
      */}
      <CreateNavButton />
    </div>
  );
}
