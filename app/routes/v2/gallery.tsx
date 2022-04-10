import type { LinksFunction, LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
import { useEffect, useState } from "react";

import ShowMore, { links as showMoreStylesUrls } from "~/components/ShowMore";
import CreateNavButton, {
  links as createNavButtonStylesUrl,
} from "~/components/CreateNavButton";
import CellsThumb, {
  links as cellsThumbStylesUrl,
} from "~/components/CellsThumb";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";

import { DDI_API_ENDPOINTS, DDI_APP_PAGES } from "~/utils/urls";

import stylesUrl from "~/styles/gallery.css";

export const links: LinksFunction = () => {
  return [
    ...showMoreStylesUrls(),
    ...cellsThumbStylesUrl(),
    ...createNavButtonStylesUrl(),
    ...unstyledLinkStylesUrl(),
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
  comics: Array<Comic>;
  hasMore: boolean;
};

type LoaderData = {
  older?: ComicsPagination;
  newer?: ComicsPagination;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const offset = url.searchParams.getAll("o")[0];
  const isNewer = url.searchParams.getAll("isNewer")[0] === "true";

  // This data request is asking for
  if (isNewer) {
    const getNewerComicsResponse = await fetch(
      DDI_API_ENDPOINTS["getPreviousComics"](offset)
    ).then((res) => res.json());

    return json({
      newer: {
        comics: getNewerComicsResponse.comics,
        hasMore: getNewerComicsResponse.hasMore,
        cursor: getNewerComicsResponse.comics[0].updatedAt,
      },
    });
  }

  const getComicsResponse = await fetch(
    DDI_API_ENDPOINTS["getComics"](offset)
  ).then((res) => res.json());

  let earliestComicUpdatedAt;
  if (getComicsResponse.comics.length > 0) {
    const earliestComic = getComicsResponse.comics[0];
    earliestComicUpdatedAt = earliestComic.updatedAt;
  }

  return json({
    older: {
      comics: getComicsResponse.comics,
      hasMore: getComicsResponse.hasMore,
      cursor: getComicsResponse.cursor,
    },
    // will only use this data on page load requests
    // to initialize the component state
    newer: {
      comics: [], //getPreviousComicsResponse.comics,
      cursor: earliestComicUpdatedAt,
      hasMore: getComicsResponse.hasMorePrevious,
    },
  });
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();
  const [olderCursor, setOlderCursor] = useState<string | null>(
    data.older?.cursor || null
  );
  const [newerCursor, setNewerCursor] = useState<string | null>(
    data.newer?.cursor || null
  );
  const [hasMoreOlderComics, setHasMoreOlderComics] = useState<boolean>(
    data.older?.hasMore || false
  );
  const [hasMoreNewerComics, setHasMoreNewerComics] = useState<boolean>(
    data.newer?.hasMore || false
  );
  const [comics, setComics] = useState<ComicsPagination["comics"]>(
    data.older?.comics || []
  );

  useEffect(() => {
    // Handle older comics
    if (data.older) {
      const olderComics = data.older.comics;
      const latestOlderCursor = data.older.cursor;

      if (latestOlderCursor !== olderCursor && olderComics.length) {
        const allComics = [...comics, ...olderComics];
        setOlderCursor(latestOlderCursor);
        setHasMoreOlderComics(data.older.hasMore);
        setComics(allComics);
      }
    } else {
      // Handle newer comics
      if (data.newer) {
        const newerComics = data.newer.comics;
        const latestNewerCursor = data.newer.cursor;

        if (latestNewerCursor !== newerCursor && newerComics.length) {
          const allComics = [...newerComics, ...comics];
          setNewerCursor(latestNewerCursor);
          setHasMoreNewerComics(data.newer.hasMore);
          setComics(allComics);
        }
      }
    }
  }, [comics, setComics, data]);

  return (
    <div>
      <div>
        {hasMoreNewerComics && <ShowMore isNewer offset={newerCursor} />}
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
        {hasMoreOlderComics && <ShowMore offset={olderCursor} />}
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
