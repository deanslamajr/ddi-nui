import {
  StudioStateFromGetComic,
  OlderStudioStateFromGetComic,
} from "~/interfaces/studioState";

// schemaVersion === 1
//  * image has included caption text
//  * initialCell.imageUrl: 'https://ddi-cells-local.s3.amazonaws.com/qxAFlitFU.png'
export type ComicFromGalleryQueries = {
  cellsCount: number;
  initialCell: {
    caption: string;
    imageUrl: string;
    order: number | null;
    schemaVersion: number;
    urlId: string;
  };
  updatedAt: string;
  urlId: string;
};

export type ComicFromGetComicApi =
  | LatestComicFromGetComicApi
  | OlderComicFromGetComicApi;

type LatestComicFromGetComicApi = {
  comicUpdatedAt: string;
  isActive: boolean;
  initialCellUrlId: string;
  title: string;
  urlId: string;
  userCanEdit: boolean;
  cells: Array<CellFromGetComicApiV4>;
};

type CellFromGetComicApiV4 = {
  urlId: string;
  imageUrl: string; // 3Zb4al5Uoi.png
  order: null;
  schemaVersion: 4;
  studioState: StudioStateFromGetComic;
  caption: string;
  previousCellUrlId: string | null;
};

export const isOlderComic = (
  comic: ComicFromGetComicApi
): comic is OlderComicFromGetComicApi => {
  return (
    typeof (comic as LatestComicFromGetComicApi).initialCellUrlId ===
    "undefined"
  );
};

/**
 * OLDER COMIC
 * e.g. https://app.drawdraw.ink/v2/gallery/comic/Bvdpd6CSPb?emoji=%F0%9F%9A%A6
 */
type OlderComicFromGetComicApi = {
  comicUpdatedAt: string;
  cells: Array<OlderCellFromGetComicApi>;
  isActive: boolean;
  title: string;
  urlId: string;
  userCanEdit: boolean;
};

// https://app.drawdraw.ink/v2/gallery/comic/Bvdpd6CSPb?emoji=%F0%9F%9A%A6
type OlderCellFromGetComicApi = {
  urlId: string;
  imageUrl: string; // https://ddi-cells-local.s3.amazonaws.com/LL5AVwK5r.png
  order: number | null; // first cell has null, second and later cells have number starting at 2
  previousCellId: null;
  schemaVersion: null;
  studioState: OlderStudioStateFromGetComic;
  caption: string;
};
