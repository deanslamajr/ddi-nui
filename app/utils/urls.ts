import { getClientVariable } from "~/utils/environment-variables";

export const getCellImageUrl = (imageUrl: string, schemaVersion: number) => {
  const cellUrl =
    schemaVersion >= 3
      ? `https://${getClientVariable("CELL_IMAGES_URL")}/${imageUrl}`
      : imageUrl;

  return cellUrl;
};

export const DDI_API_ENDPOINTS = {
  getComics: (offset?: string) =>
    `${getClientVariable("LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL")}/api/comics${
      offset ? "?offset=" + offset : ""
    }`,
};

export const DDI_APP_PAGES = {
  getComicPageUrl: (comidUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/comic/${comidUrlId}`;
  },
};
