import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, SkewEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const skewEmoji: ComicStudioStateReducer<SkewEmojiAction> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    if (action.data.type === "HORIZONTAL") {
      activeEmoji.skewX = action.data.newSkewValue;
    } else {
      activeEmoji.skewY = action.data.newSkewValue;
    }

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error(
        `Cell state not found for cellUrlId:${action.data.cellUrlId}!`
      );
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

export default skewEmoji;
