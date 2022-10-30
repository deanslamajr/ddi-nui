import { FC, useEffect, useState } from "react";
import { usePageVisibility } from "react-page-visibility";
import type { LinksFunction } from "@remix-run/node";

import sortComics from "~/utils/sortComics";
import {
  getLatestTimestamp,
  setLatestTimestamp,
} from "~/utils/__clientCache/latestTimestamp";
import { DDI_API_ENDPOINTS } from "~/utils/urls";
import getClientCookies from "~/utils/getClientCookiesForFetch";

import { LoaderData } from "~/loaders/gallery";

import { ComicFromGalleryQueries } from "~/interfaces/comic";

import ComicsPreviewContainer, {
  links as galleryStylesUrls,
} from "./ComicsPreviewContainer";

export const links: LinksFunction = () => {
  return [...galleryStylesUrls()];
};

const Gallery: FC<{
  data: LoaderData;
  generateComicLink: (comicUrlId: string) => string;
  shouldCollapseHeader?: boolean;
  shouldPollForUpdates?: boolean;
  urlPathForGalleryData?: string;
}> = ({
  data,
  generateComicLink,
  shouldCollapseHeader,
  shouldPollForUpdates = true,
  urlPathForGalleryData,
}) => {
  const [state, setState] = useState<{
    comics: ComicFromGalleryQueries[];
    hasMoreNewer: boolean;
    hasMoreOlder: boolean;
    newerCursor: string | null;
    olderCursor: string | null;
  }>({
    comics: [],
    hasMoreNewer: true,
    hasMoreOlder: true,
    newerCursor: null,
    olderCursor: null,
  });

  const [showNewComicsExistButton, setShowNewComicsExistButton] =
    useState<boolean>(false);

  const isVisible = usePageVisibility();

  useEffect(() => {
    setState((prevState) => {
      const olderComics = data.older?.comics;
      const newerComics = data.newer?.comics;

      let allComics: ComicFromGalleryQueries[] | null = null;
      let hasMoreOlderComics: boolean = prevState.hasMoreOlder;
      let hasMoreNewerComics: boolean = prevState.hasMoreNewer;

      // Handle older comics
      if (olderComics) {
        const latestOlderCursor = data.older.cursor;

        if (data.isSearch) {
          allComics = [...olderComics];
        } else if (
          latestOlderCursor !== prevState.olderCursor &&
          olderComics.length
        ) {
          allComics = [...prevState.comics, ...olderComics];
        }
        hasMoreOlderComics = data.older.hasMore;
      } else {
        // Handle newer comics
        const latestNewerCursor = data.newer.cursor;

        if (
          newerComics &&
          latestNewerCursor !== prevState.newerCursor &&
          newerComics.length
        ) {
          allComics = [...newerComics, ...prevState.comics];
        }
        hasMoreNewerComics = data.newer.hasMore;
      }

      const sortedComics =
        allComics !== null ? sortComics(allComics) : [...prevState.comics];

      const latestNewerCursor = sortedComics.length
        ? sortedComics[0].updatedAt
        : null;
      const latestOlderCursor = sortedComics.length
        ? sortedComics[sortedComics.length - 1].updatedAt
        : null;

      return {
        comics: sortedComics,
        hasMoreNewer: hasMoreNewerComics,
        hasMoreOlder: hasMoreOlderComics,
        newerCursor: latestNewerCursor,
        olderCursor: latestOlderCursor,
      };
    });
  }, [setState, data]);

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
    if (shouldPollForUpdates) {
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
            DDI_API_ENDPOINTS.getPreviousComics(`${latestTimestamp}`),
            getClientCookies()
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
    }
  }, [isVisible, shouldPollForUpdates]);

  return (
    <ComicsPreviewContainer
      comics={state.comics}
      isNewComicsExistVisible={showNewComicsExistButton}
      isShowMoreNewerVisible={data.hasCursor && state.hasMoreNewer}
      isShowMoreOlderVisible={state.hasMoreOlder}
      generateComicLink={generateComicLink}
      newerCursor={state.newerCursor}
      olderCursor={state.olderCursor}
      shouldCollapseHeader={shouldCollapseHeader}
      urlPathForGalleryData={urlPathForGalleryData}
    />
  );
};

export default Gallery;
