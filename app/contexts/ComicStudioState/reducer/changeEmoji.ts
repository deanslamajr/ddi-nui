import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, ChangeEmojiAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const changeEmoji: ComicStudioStateReducer<ChangeEmojiAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    activeEmoji.emoji = action.data.newEmoji;

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

export default changeEmoji;
