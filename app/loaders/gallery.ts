import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { Comic } from "~/interfaces/comic";
import {
  OLDER_OFFSET_QUERYSTRING,
  NEWER_OFFSET_QUERYSTRING,
  CAPTION_FILTER_QUERYSTRING,
  EMOJI_FILTER_QUERYSTRING,
} from "~/components/ShowMore";

import { DDI_API_ENDPOINTS } from "~/utils/urls";
import sortComics from "~/utils/sortComics";

type ComicsPagination = {
  cursor: string | null;
  comics?: Array<Comic>;
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
}: {
  hasCursor: boolean;
  newerOffset: string;
}): Promise<LoaderData> => {
  let getNewerComicsResponse: {
    comics: Comic[];
    hasMoreNewer: boolean;
  } | null = null;

  try {
    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getPreviousComics(newerOffset)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    getNewerComicsResponse = await response.json();
  } catch (error: any) {
    // TODO better logging
    console.error(error);
  }

  const comics: Comic[] = getNewerComicsResponse?.comics || [];
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
}: {
  captionSearch?: string;
  emojiFilter?: string;
  hasCursor: boolean;
  offset?: string;
}): Promise<LoaderData> => {
  let getComicsResponse: {
    comics: Comic[];
    cursor: string;
    hasMoreOlder: boolean;
  } | null = null;

  try {
    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getComics({
        captionSearch,
        emojiFilter,
        offset,
      })
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
  const comics: Comic[] = getComicsResponse?.comics || [];
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

  const olderOffset = url.searchParams.getAll(OLDER_OFFSET_QUERYSTRING)[0];
  const newerOffset = url.searchParams.getAll(NEWER_OFFSET_QUERYSTRING)[0];
  const captionSearch = url.searchParams.getAll(CAPTION_FILTER_QUERYSTRING)[0];
  const emojiFilter = url.searchParams.getAll(EMOJI_FILTER_QUERYSTRING)[0];

  const hasCursor = Boolean(olderOffset || newerOffset);

  if (newerOffset) {
    const newerComicsResponse = await fetchNewerComics({
      hasCursor,
      newerOffset,
    });

    return json(newerComicsResponse);
  }

  const olderComicsResponse = await fetchOlderComics({
    captionSearch,
    emojiFilter,
    hasCursor,
    offset: olderOffset,
  });

  return json(olderComicsResponse);
};

export default loader;
