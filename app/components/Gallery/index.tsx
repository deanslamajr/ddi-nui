import { FC, useEffect, useState } from "react";
import { usePageVisibility } from "react-page-visibility";
import type { LinksFunction } from "remix";

import sortComics from "~/utils/sortComics";
import {
  getLatestTimestamp,
  setLatestTimestamp,
} from "~/utils/__clientCache/latestTimestamp";
import { DDI_API_ENDPOINTS } from "~/utils/urls";

import { LoaderData } from "~/loaders/gallery";

import { Comic } from "~/interfaces/comic";

import ComicsPreviewContainer, {
  links as galleryStylesUrls,
} from "./ComicsPreviewContainer";

export const links: LinksFunction = () => {
  return [...galleryStylesUrls()];
};

type Props = {
  data: LoaderData;
  generateComicLink: (comicUrlId: string) => string;
  useRemixLinks?: boolean;
};

const Gallery: FC<Props> = ({ data, generateComicLink, useRemixLinks }) => {
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
    <ComicsPreviewContainer
      comics={comics}
      isNewComicsExistVisible={showNewComicsExistButton}
      isShowMoreNewerVisible={data.hasCursor && hasMoreNewerComics}
      isShowMoreOlderVisible={hasMoreOlderComics}
      generateComicLink={generateComicLink}
      newerCursor={newerCursor}
      olderCursor={olderCursor}
      useRemixLinks={useRemixLinks}
    />
  );
};

export default Gallery;
