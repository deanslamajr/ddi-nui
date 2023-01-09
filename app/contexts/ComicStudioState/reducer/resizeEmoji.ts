import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, ResizeEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const resizeEmoji: ComicStudioStateReducer<ResizeEmojiAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    activeEmoji.size = action.data.newSize;

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error("Cell state not found!");
    }

    if (action.data.shouldSaveChange) {
      addNewCellChangeToHistory(cellState);
    }

    return clonedState;
  } catch (e) {
    return state;
  }
};

export default resizeEmoji;
