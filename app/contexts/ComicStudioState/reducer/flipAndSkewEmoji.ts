import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, FlipAndSkewEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const flipAndSkewEmoji: ComicStudioStateReducer<FlipAndSkewEmojiAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    activeEmoji.skewX = action.data.newSkew.x;
    activeEmoji.skewY = action.data.newSkew.y;
    activeEmoji.scaleX = action.data.newScale.x;
    activeEmoji.scaleY = action.data.newScale.y;

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

export default flipAndSkewEmoji;
