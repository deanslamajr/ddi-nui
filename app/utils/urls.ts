import { getClientVariable } from "~/utils/environment-variables";

export const getCellImageUrl = (imageUrl: string, schemaVersion: number) => {
  const cellUrl =
    schemaVersion >= 3
      ? `https://${getClientVariable("CELL_IMAGES_URL")}/${imageUrl}`
      : imageUrl;

  return cellUrl;
};

// From https://www.geeksforgeeks.org/javascript-check-whether-a-url-string-is-absolute-or-relative/
export const isUrlAbsolute = (url: string): boolean => {
  const RgExp = new RegExp("^(?:[a-z]+:)?//", "i");
  return RgExp.test(url);
};

export const DDI_API_ENDPOINTS = {
  deleteComic: (comicUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}`;
  },
  getCell: (cellUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/cell/${cellUrlId}`;
  },
  getComic: (comicUrlId: string) => {
    return `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}`;
  },
  getComics: ({
    captionSearch,
    emojiFilter,
    offset,
  }: {
    captionSearch?: string;
    emojiFilter?: string;
    offset?: string;
  }) => {
    const url = new URL(
      `${getClientVariable("LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL")}/api/comics`
    );
    if (offset !== undefined) {
      url.searchParams.append("offset", offset);
    }
    if (captionSearch !== undefined) {
      url.searchParams.append("caption", captionSearch);
    }
    if (emojiFilter !== undefined) {
      url.searchParams.append("emoji", emojiFilter);
    }
    return url.toString();
  },
  getPreviousComics: (offset: string) =>
    `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comics/latest?latestUpdatedAt=${offset}`,
  signComicCells: (comicUrlId: string) =>
    `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}/sign`,
  updateComic: (comicUrlId: string) =>
    `${getClientVariable(
      "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}`,
};

export const DDI_APP_PAGES = {
  cell: (comidUrlId: string, cellUrlId: string) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/gallery/comic/${comidUrlId}/cell/${cellUrlId}`;
  },
  comic: (comidUrlId: string) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/gallery/comic/${comidUrlId}`;
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
