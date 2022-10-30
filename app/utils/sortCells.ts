import { CellFromClientCache } from "~/utils/clientCache";
import {
  ComicFromGetComicApi,
  isOlderComic,
  isCellWithoutOrderFieldOnCell,
  NewerCellWithOrderFieldFromGetComicApi,
  Newer2CellWithOrderFieldFromGetComicApi,
  AllCellsFromGetComicApi,
} from "~/interfaces/comic";

export const sortCellsV4 = <
  T extends {
    previousCellUrlId?: string | null | undefined;
    urlId: string;
  }
>(
  cells: T[],
  initialCellUrlId?: string | null
): T[] => {
  const sortedCells = [] as T[];

  if (!initialCellUrlId) {
    return sortedCells;
  }

  let nextCellUrlId: string | undefined | null = initialCellUrlId;
  let nextCell = cells.find(({ urlId }) => urlId === nextCellUrlId);

  while (nextCell) {
    sortedCells.push(nextCell);
    nextCell = cells.find(
      ({ previousCellUrlId }) => previousCellUrlId === nextCellUrlId
    );
    nextCellUrlId = nextCell && nextCell.urlId;
  }

  return sortedCells;
};

export const sortByOrder = ({ order: orderA }: any, { order: orderB }: any) => {
  if (orderA === null && orderB === null) {
    return -1;
  } else if (orderA === null) {
    return -1;
  } else if (orderB === null) {
    return 1;
  }
  return orderA - orderB;
};

export const sortCellsFromGetComic = (
  comicFromGetComic: ComicFromGetComicApi
): AllCellsFromGetComicApi[] => {
  if (isOlderComic(comicFromGetComic)) {
    const cells = Array.from(comicFromGetComic.cells); // create new array ref for sort
    return cells.sort(sortByOrder);
  }

  const cellsFromComic = comicFromGetComic.cells;

  if (isCellWithoutOrderFieldOnCell(cellsFromComic)) {
    return sortCellsV4(cellsFromComic, comicFromGetComic.initialCellUrlId);
  }

  const cells = Array.from<
    | NewerCellWithOrderFieldFromGetComicApi
    | Newer2CellWithOrderFieldFromGetComicApi
  >(cellsFromComic); // create new array ref for sort

  return cells.sort(sortByOrder);
};
