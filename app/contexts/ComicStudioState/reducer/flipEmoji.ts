import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, FlipEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const flipEmoji: ComicStudioStateReducer<FlipEmojiAction> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    if (action.data.type === "HORIZONTAL") {
      activeEmoji.scaleX = activeEmoji.scaleX * -1;
    } else {
      activeEmoji.scaleY = activeEmoji.scaleY * -1;
    }

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error(
        `Cell state not found for cellUrlId:${action.data.cellUrlId}!`
      );
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

export default flipEmoji;
