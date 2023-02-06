import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, UpdateRGBAFilterAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const updateRGBAFilter: ComicStudioStateReducer<UpdateRGBAFilterAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    const { red, blue, green, alpha } = action.data.newFilterValues;

    activeEmoji.alpha = alpha;
    activeEmoji.red = red;
    activeEmoji.blue = blue;
    activeEmoji.green = green;

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

export default updateRGBAFilter;
