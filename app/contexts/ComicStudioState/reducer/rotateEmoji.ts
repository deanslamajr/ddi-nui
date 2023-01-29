import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, RotateEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const resizeEmoji: ComicStudioStateReducer<RotateEmojiAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    activeEmoji.rotation = action.data.newRotation;

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error("Cell state not found!");
    }

    cellState.isDirty = true;
    cellState.hasNewImage = true;

    if (action.data.shouldSaveChange) {
      addNewCellChangeToHistory(cellState);
    }

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default resizeEmoji;
