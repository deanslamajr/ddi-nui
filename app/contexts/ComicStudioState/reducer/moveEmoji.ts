import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, MoveEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const moveEmoji: ComicStudioStateReducer<MoveEmojiAction> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    if ("diff" in action.data) {
      activeEmoji.x = activeEmoji.x + action.data.diff.x;
      activeEmoji.y = activeEmoji.y + action.data.diff.y;
    } else {
      activeEmoji.x = action.data.abs.x;
      activeEmoji.y = action.data.abs.y;
    }

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error("Cell state not found!");
    }

    cellState.isDirty = true;
    cellState.hasNewImage = true;

    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default moveEmoji;
