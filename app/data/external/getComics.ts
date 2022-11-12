import { DDI_API_ENDPOINTS } from "~/utils/urls";
import getClientCookies from "~/utils/getClientCookiesForFetch";

import { ComicFromGetComicApi } from "~/interfaces/comic";

export const get = async (
  comicUrlId: string
): Promise<ComicFromGetComicApi | null> => {
  let comicFromApi: ComicFromGetComicApi;

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
