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

export const isCellWithoutOrderFieldOnCell = (
  cells:
    | CellFromGetComicApiV4[]
    | NewerCellWithOrderFieldFromGetComicApi[]
    | Newer2CellWithOrderFieldFromGetComicApi[]
): cells is CellFromGetComicApiV4[] => {
  return (cells as CellFromGetComicApiV4[]).every(
    ({ order }) => order === null
  );
};

export const isOlderComic = (
  comic: ComicFromGetComicApi
): comic is OlderComicFromGetComicApi => {
  return (
    typeof (comic as LatestComicFromGetComicApi).initialCellUrlId ===
    "undefined"
  );
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
  cells:
    | CellFromGetComicApiV4[]
    | NewerCellWithOrderFieldFromGetComicApi[]
    | Newer2CellWithOrderFieldFromGetComicApi[];
};

/**
 * OLDER COMIC
 * e.g. https://app.drawdraw.ink/v2/gallery/comic/Bvdpd6CSPb?emoji=%F0%9F%9A%A6
 */
type OlderComicFromGetComicApi = {
  comicUpdatedAt: string;
  cells: Array<OlderCellWithOrderFieldFromGetComicApi>;
  isActive: boolean;
  title: string;
  urlId: string;
  userCanEdit: boolean;
};

export type AllCellsFromGetComicApi =
  | CellFromGetComicApiV4
  | NewerCellWithOrderFieldFromGetComicApi
  | Newer2CellWithOrderFieldFromGetComicApi
  | OlderCellWithOrderFieldFromGetComicApi;

export type CellFromGetComicApiV4 = {
  urlId: string;
  imageUrl: string; // 3Zb4al5Uoi.png
  order: null;
  schemaVersion: 4;
  studioState: StudioStateFromGetComic;
  caption: string;
  previousCellUrlId: string | null;
};

type CellWithOrderFieldFromGetComicApiBase = {
  caption: string;
  imageUrl: string; // https://ddi-cells-local.s3.amazonaws.com/LL5AVwK5r.png
  previousCellId: null;
  studioState: OlderStudioStateFromGetComic;
  urlId: string;
};

// https://app.drawdraw.ink/v2/gallery/comic/v5S_Wew1r
export type NewerCellWithOrderFieldFromGetComicApi = {
  order: number;
  schemaVersion: null;
} & CellWithOrderFieldFromGetComicApiBase;

// https://qa.drawdraw.ink/v2/gallery/comic/z5g18zVXhA?oo=2019-10-28T00%3A56%3A28.594Z
export type Newer2CellWithOrderFieldFromGetComicApi = {
  order: number;
  schemaVersion: 2;
} & CellWithOrderFieldFromGetComicApiBase;

// https://app.drawdraw.ink/v2/gallery/comic/Bvdpd6CSPb?emoji=%F0%9F%9A%A6
export type OlderCellWithOrderFieldFromGetComicApi = {
  order: number | null; // first cell has null, second and later cells have number starting at 2
  schemaVersion: null;
} & CellWithOrderFieldFromGetComicApiBase;
