import { getClientVariable } from "~/utils/environment-variables";

export const getCellImageUrl = (imageUrl: string, schemaVersion: number) => {
  const cellUrl =
    schemaVersion >= 3
      ? `https://${getClientVariable("CELL_IMAGES_URL")}/${imageUrl}`
      : imageUrl;

  return cellUrl;
};

export const DDI_API_ENDPOINTS = {
  getComics: (isPageLoadRequest: boolean, offset?: string) => {
    const url = new URL(
      `${getClientVariable("LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL")}/api/comics`
    );
    url.searchParams.set(
      "isPageLoadRequest",
      isPageLoadRequest ? "true" : "false"
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
  getDraftsPageUrl: () => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/me/drafts`;
  },
};
