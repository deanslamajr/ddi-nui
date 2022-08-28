import { getClientVariable } from "~/utils/environment-variables";

export const getCellImageUrl = (imageUrl: string, schemaVersion: number) => {
  const cellUrl =
    schemaVersion >= 3
      ? `https://${getClientVariable("CELL_IMAGES_URL")}/${imageUrl}`
      : imageUrl;

  return cellUrl;
};

export const DDI_API_ENDPOINTS = {
  deleteComic: (comicUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}`;
  },
  getComic: (comicUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}`;
  },
  getComics: (offset?: string) => {
    const url = new URL(
      `${getClientVariable("LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL")}/api/comics`
    );
    if (offset !== undefined) {
      url.searchParams.append("offset", offset);
    }
    return url.toString();
  },
  getPreviousComics: (offset: string) =>
    `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comics/latest?latestUpdatedAt=${offset}`,
};

export const DDI_APP_PAGES = {
  comic: (comidUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/comic/${comidUrlId}`;
  },
  drafts: (searchParams?: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/me/drafts${searchParams ? `?${searchParams}` : ""}`;
  },
  gallery: () => {
    return `${getClientVariable("APP_PATH_PREFIX")}/gallery`;
  },
  cellStudio: (cellUrlId?: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/s/cell/${cellUrlId || "new"}`;
  },
  comicStudio: (comicUrlId: string) => {
    return `${getClientVariable("APP_PATH_PREFIX")}/s/comic/${comicUrlId}`;
  },
  comicStudioCopyFromComicCell: (
    editedComicUrlId: string,
    copiedComicUrlId: string
  ) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/s/comic/${editedComicUrlId}/copyFromComic/${copiedComicUrlId}`;
  },
  comicStudioCopyFromComic: (comicUrlId: string) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/s/comic/${comicUrlId}/copyFromComic`;
  },
};
