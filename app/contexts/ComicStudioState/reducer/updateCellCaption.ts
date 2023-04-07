import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, UpdateCellCaptionAction } from "../types";
import { getCellState, getCellStudioState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const updateCellCaption: ComicStudioStateReducer<UpdateCellCaptionAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);
    const clonedStudioState = getCellStudioState(
      clonedState,
      action.data.cellUrlId
    );

    if (!clonedStudioState) {
      throw new Error("studioState is null!");
    }

    clonedStudioState.caption = action.data.caption;

    const clonedCellState = getCellState(clonedState, action.data.cellUrlId);
    if (!clonedCellState || !clonedCellState.studioState) {
      throw new Error("Cell state not found!");
    }
    clonedCellState.isDirty = true;

    addNewCellChangeToHistory(clonedCellState);
    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default updateCellCaption;
