import { getClientVariable } from "~/utils/environment-variables";
import { SEARCH_PARAMS } from "~/utils/constants";

export const getCellImageUrl = (
  imageUrl: string,
  schemaVersion: number,
  isDebugProdCell?: boolean
) => {
  const cellUrl =
    schemaVersion >= 3
      ? `https://${getClientVariable(
          isDebugProdCell ? "CELL_IMAGES_URL_PROD" : "CELL_IMAGES_URL"
        )}/${imageUrl}`
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
  getCell: (cellUrlId: string, isDebugProdCell?: boolean) => {
    return `${getClientVariable(
      isDebugProdCell
        ? "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL_PROD"
        : "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/cell/${cellUrlId}`;
  },
  getComic: (comicUrlId: string, isDebugProdCell?: boolean) => {
    return `${getClientVariable(
      isDebugProdCell
        ? "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL_PROD"
        : "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
    )}/api/comic/${comicUrlId}`;
  },
  getComics: ({
    captionSearch,
    emojiFilter,
    offset,
    isDebugProdCell,
  }: {
    captionSearch?: string;
    emojiFilter?: string;
    offset?: string;
    isDebugProdCell?: boolean;
  }) => {
    const url = new URL(
      `${getClientVariable(
        isDebugProdCell
          ? "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL_PROD"
          : "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
      )}/api/comics`
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
  getPreviousComics: (offset: string, isDebugProdCell?: boolean) =>
    `${getClientVariable(
      isDebugProdCell
        ? "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL_PROD"
        : "LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL"
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
  cell: (comidUrlId: string, cellUrlId: string, isDebugProdCell?: boolean) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/gallery/comic/${comidUrlId}/cell/${cellUrlId}${
      isDebugProdCell ? `?${SEARCH_PARAMS.DEBUG_PROD_CELL}` : ""
    }`;
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
  cellStudio: (
    {
      comicUrlId = "new",
      cellUrlId = "new",
    }:
      | {
          comicUrlId?: string;
          cellUrlId?: string;
        }
      | undefined = { comicUrlId: "new", cellUrlId: "new" }
  ) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/s/comic/${comicUrlId}/cell/${cellUrlId}`;
  },
  comicStudio: (options: { comicUrlId?: string } = {}) => {
    return `${getClientVariable("APP_PATH_PREFIX")}/s/comic/${
      options.comicUrlId || "new"
    }`;
  },
  comicStudioCopyFromComicCell: (
    editedComicUrlId: string,
    copiedComicUrlId: string,
    isDebugProdCell?: boolean
  ) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/s/comic/${editedComicUrlId}/copyFromComic/${copiedComicUrlId}${
      isDebugProdCell ? `?${SEARCH_PARAMS.DEBUG_PROD_CELL}` : ""
    }`;
  },
  comicStudioCopyFromComic: (comicUrlId: string) => {
    return `${getClientVariable(
      "APP_PATH_PREFIX"
    )}/s/comic/${comicUrlId}/copyFromComic`;
  },
};
