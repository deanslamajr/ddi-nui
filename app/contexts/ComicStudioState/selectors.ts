import { ComicStudioState } from "./types";

export const getActiveEmoji = (state: ComicStudioState, cellUrlId: string) => {
  // get cell state
  const cellState = getCellState(state, cellUrlId);
  if (!cellState || !cellState.studioState) {
    return null;
  }

  return cellState.studioState.emojis[cellState.studioState.activeEmojiId];
};

export const getEmojiSize = (state: ComicStudioState, cellUrlId: string) => {
  const activeEmoji = getActiveEmoji(state, cellUrlId);
  if (!activeEmoji) {
    return null;
  }

  return activeEmoji.size;
};

export const getEmojiRotation = (
  state: ComicStudioState,
  cellUrlId: string
) => {
  const activeEmoji = getActiveEmoji(state, cellUrlId);
  if (!activeEmoji) {
    return null;
  }

  return activeEmoji.rotation;
};

export const getEmojiSkew = (state: ComicStudioState, cellUrlId: string) => {
  const activeEmoji = getActiveEmoji(state, cellUrlId);
  if (!activeEmoji) {
    return null;
  }

  return {
    skewX: activeEmoji.skewX,
    skewY: activeEmoji.skewY,
  };
};

export const getCellState = (state: ComicStudioState, cellUrlId: string) => {
  return state.comicState.cells
    ? state.comicState.cells[cellUrlId] || null
    : null;
};

export const getCellStudioState = (
  state: ComicStudioState,
  cellUrlId: string
) => {
  const cellState = getCellState(state, cellUrlId);
  return cellState && cellState.studioState ? cellState.studioState : null;
};

export const getActiveEmojiId = (
  state: ComicStudioState,
  cellUrlId: string
) => {
  const cellStudioState = getCellStudioState(state, cellUrlId);
  return cellStudioState ? cellStudioState.activeEmojiId : null;
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
