import { DDI_API_ENDPOINTS } from "~/utils/urls";
import getClientCookies from "~/utils/getClientCookiesForFetch";

import { StudioState } from "~/interfaces/studioState";

type ComicCellLegacy = {
  urlId: string;
  imageUrl: string;
  order: number | null;
  schemaVersion: number | null;
  studioState: StudioState | null;
  caption: string | null;
  previousCellUrlId: string | null;
};

export type ComicFromLegacyGetComicApi = {
  cells: ComicCellLegacy[];
  comicUpdatedAt: string;
  isActive: boolean;
  initialCellUrlId: string;
  title: string;
  urlId: string;
  userCanEdit: true;
};

export const get = async (
  comicUrlId: string
): Promise<ComicFromLegacyGetComicApi | null> => {
  let comicFromApi: ComicFromLegacyGetComicApi;

  try {
    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getComic(comicUrlId),
      getClientCookies()
    );

    if (!response.ok) {
      // errorAttributes = {
      //   statusCode: response.status.toString(),
      //   url: response.url,
      //   statusText: response.statusText,
      // };
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    comicFromApi = await response.json();
  } catch (error: any) {
    // TODO better logging
    console.error(error);
    return null;
  }

  return comicFromApi;
};
