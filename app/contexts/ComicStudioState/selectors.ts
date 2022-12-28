import { ComicStudioState } from "./types";

export const getCellState = (state: ComicStudioState, cellUrlId: string) => {
  return state.comicState.cells
    ? state.comicState.cells[cellUrlId] || null
    : null;
};
