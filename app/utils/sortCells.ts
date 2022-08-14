import { CellFromClientCache } from "~/utils/clientCache";

export const sortCellsV4 = (
  cells: CellFromClientCache[],
  initialCellUrlId?: string | null
) => {
  const sortedCells = [] as CellFromClientCache[];

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
