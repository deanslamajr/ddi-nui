import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, UpdateBackgroundColorAction } from "../types";
import { getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const updateBackgroundColor: ComicStudioStateReducer<
  UpdateBackgroundColorAction
> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const clonedCellState = getCellState(clonedState, action.data.cellUrlId);
    if (!clonedCellState || !clonedCellState.studioState) {
      throw new Error("Cell state not found!");
    }

    clonedCellState.studioState.backgroundColor =
      action.data.newBackgroundColor;

    clonedCellState.isDirty = true;
    clonedCellState.hasNewImage = true;

    addNewCellChangeToHistory(clonedCellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default updateBackgroundColor;
