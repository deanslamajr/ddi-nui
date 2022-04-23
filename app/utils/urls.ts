import { getClientVariable } from "~/utils/environment-variables";
import isServerContext from "./isServerContext";

export const getCellImageUrl = (imageUrl: string, schemaVersion: number) => {
  const cellUrl =
    schemaVersion >= 3
      ? `https://${getClientVariable("CELL_IMAGES_URL")}/${imageUrl}`
      : imageUrl;

  return cellUrl;
};

export const DDI_API_ENDPOINTS = {
  getComics: (
    isPageLoadRequest: boolean,
    offset?: string,
    includeComicAtOffset?: boolean
  ) => {
    const url = new URL(
      `${getClientVariable("LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL")}/api/comics`
    );
    url.searchParams.set(
      "isPageLoadRequest",
      isPageLoadRequest ? "true" : "false"
    );
    url.searchParams.set(
      "includeComicAtOffset",
      includeComicAtOffset ? "true" : "false"
    );
    if (offset !== undefined) {
      url.searchParams.append("offset", offset);
    }
    return url.toString();
  },
  getPreviousComics: (offset: string, isPageLoadRequest: boolean) =>
    `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comics/latest?latestUpdatedAt=${offset}&isPageLoadRequest=${isPageLoadRequest}`,
};

export const DDI_APP_PAGES = {
  getComicPageUrl: (comidUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/comic/${comidUrlId}`;
  },
  getDraftsPageUrl: (searchParams?: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/me/drafts${searchParams ? `?${searchParams}` : ""}`;
  },
};
