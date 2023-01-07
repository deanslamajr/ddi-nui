import { ComicStudioState } from "./types";

export const getCellState = (state: ComicStudioState, cellUrlId: string) => {
  return state.comicState.cells
    ? state.comicState.cells[cellUrlId] || null
    : null;
};

export const getPreviousCellChangeId = (
  state: ComicStudioState,
  cellUrlId: string
): string | null => {
  const cellState = getCellState(state, cellUrlId);

  if (!cellState || !cellState.changeHistory) {
    return null;
  }

  const latestCellChange =
    cellState.changeHistory.changes[cellState.changeHistory.currentChangeId];

  if (!latestCellChange) {
    return null;
  }

  return latestCellChange.prevChangeId;
};

export const getNextCellChangeId = (
  state: ComicStudioState,
  cellUrlId: string
): string | null => {
  const cellState = getCellState(state, cellUrlId);

  if (!cellState || !cellState.changeHistory) {
    return null;
  }

  const latestCellChange =
    cellState.changeHistory.changes[cellState.changeHistory.currentChangeId];

  if (!latestCellChange) {
    return null;
  }

  return latestCellChange.nextChangeId.length
    ? latestCellChange.nextChangeId[0]
    : null;
};
