import newrelic from "newrelic";
import type { LoaderFunction } from "remix";
import { json } from "remix";

import { Comic } from "~/interfaces/comic";
import {
  OLDER_OFFSET_QUERYSTRING,
  NEWER_OFFSET_QUERYSTRING,
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
};

const loader: LoaderFunction = async ({ request }) => {
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

export default loader;
