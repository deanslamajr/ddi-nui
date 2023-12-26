import https from "https";
import { DDI_API_ENDPOINTS } from "~/utils/urls";
import getClientCookies from "~/utils/getClientCookiesForFetch";
import isServerContext from "~/utils/isServerContext";

import { ComicFromGetComicApi } from "~/interfaces/comic";

export const get = async (
  comicUrlId: string,
  isDebugProdCell?: boolean
): Promise<ComicFromGetComicApi | null> => {
  let comicFromApi: ComicFromGetComicApi;

  try {
    const crossEnvOptions = isDebugProdCell
      ? isServerContext()
        ? {
            agent: new https.Agent({
              rejectUnauthorized: false,
            }),
          }
        : { credentials: "omit" }
      : undefined;

    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getComic(comicUrlId, isDebugProdCell),
      crossEnvOptions ? (crossEnvOptions as unknown as any) : getClientCookies()
    );

    if (!response.ok) {
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
