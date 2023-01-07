import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, MoveEmojiAction } from "../types";
import { getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";
import { CellFromClientCache } from "~/utils/clientCache/cell";

const updateComicStudioState = (
  cellState: CellFromClientCache,
  action: Parameters<ComicStudioStateReducer<MoveEmojiAction>>[1]
): void => {
  const emojis = cellState.studioState?.emojis || {};
  const activeEmojiId = action.data.emojiId;
  const activeEmoji = emojis[activeEmojiId];

  emojis[activeEmojiId].x = activeEmoji.x + action.data.xDiff;
  emojis[activeEmojiId].y = activeEmoji.y + action.data.yDiff;
};

const moveEmoji: ComicStudioStateReducer<MoveEmojiAction> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error("Cell state not found!");
    }

    updateComicStudioState(cellState, action);
    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    return state;
  }
};

export default moveEmoji;
