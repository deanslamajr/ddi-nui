import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, UpdateOpacityFilterAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const updateRGBAFilter: ComicStudioStateReducer<UpdateOpacityFilterAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    activeEmoji.opacity = action.data.newOpacity;

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
