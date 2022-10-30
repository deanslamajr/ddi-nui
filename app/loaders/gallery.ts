import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { ComicFromGalleryQueries } from "~/interfaces/comic";

import { DDI_API_ENDPOINTS } from "~/utils/urls";
import sortComics from "~/utils/sortComics";
import getClientCookies from "~/utils/getClientCookiesForFetch";
import { SEARCH_PARAMS } from "~/utils/constants";

type ComicsPagination = {
  cursor: string | null;
  comics?: Array<ComicFromGalleryQueries>;
  hasMore: boolean;
};

export type LoaderData = {
  hasCursor: boolean;
  older: ComicsPagination;
  newer: ComicsPagination;
  isSearch: boolean;
};

const fetchNewerComics = async ({
  hasCursor,
  newerOffset,
  request,
}: {
  hasCursor: boolean;
  newerOffset: string;
  request: Request;
}): Promise<LoaderData> => {
  let getNewerComicsResponse: {
    comics: ComicFromGalleryQueries[];
    hasMoreNewer: boolean;
  } | null = null;

  try {
    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getPreviousComics(newerOffset),
      getClientCookies(request)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    getNewerComicsResponse = await response.json();
  } catch (error: any) {
    // TODO better logging
    console.error(error);
  }

  const comics: ComicFromGalleryQueries[] =
    getNewerComicsResponse?.comics || [];
  const hasComics = comics.length > 0;
  const sortedComics = sortComics(comics);

  return {
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
    isSearch: false,
  };
};

const fetchOlderComics = async ({
  captionSearch,
  emojiFilter,
  hasCursor,
  offset,
  request,
}: {
  captionSearch?: string;
  emojiFilter?: string;
  hasCursor: boolean;
  offset?: string;
  request: Request;
}): Promise<LoaderData> => {
  let getComicsResponse: {
    comics: ComicFromGalleryQueries[];
    cursor: string;
    hasMoreOlder: boolean;
  } | null = null;

  try {
    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getComics({
        captionSearch,
        emojiFilter,
        offset,
      }),
      getClientCookies(request)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    getComicsResponse = await response.json();
  } catch (error: any) {
    // TODO better logging
    console.error(error);
  }

  let earliestComicUpdatedAt;
  const comics: ComicFromGalleryQueries[] = getComicsResponse?.comics || [];
  if (comics.length > 0) {
    const earliestComic = comics[0];
    earliestComicUpdatedAt = earliestComic.updatedAt;
  }

  return {
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
    isSearch: Boolean(captionSearch || emojiFilter),
  };
};

const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const olderOffset = url.searchParams.getAll(
    SEARCH_PARAMS.OLDER_OFFSET_QUERYSTRING
  )[0];
  const newerOffset = url.searchParams.getAll(
    SEARCH_PARAMS.NEWER_OFFSET_QUERYSTRING
  )[0];
  const captionSearch = url.searchParams.getAll(
    SEARCH_PARAMS.CAPTION_FILTER_QUERYSTRING
  )[0];
  const emojiFilter = url.searchParams.getAll(
    SEARCH_PARAMS.EMOJI_FILTER_QUERYSTRING
  )[0];

  const hasCursor = Boolean(olderOffset || newerOffset);

  if (newerOffset) {
    const newerComicsResponse = await fetchNewerComics({
      hasCursor,
      newerOffset,
      request,
    });

    return json(newerComicsResponse);
  }

  const olderComicsResponse = await fetchOlderComics({
    captionSearch,
    emojiFilter,
    hasCursor,
    offset: olderOffset,
    request,
  });

  return json(olderComicsResponse);
};

export default loader;
