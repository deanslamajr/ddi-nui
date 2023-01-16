import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, UndoCellAction } from "../types";
import { getCellState } from "../selectors";

const undoCellUpdate: ComicStudioStateReducer<UndoCellAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    // Get Cell state
    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error("Cell state not found!");
    }

    // Grab state from history
    if (!cellState.changeHistory) {
      throw new Error("Cell state history not found!");
    }
    const prevCellChange =
      cellState.changeHistory.changes[action.data.prevCellChangeId];
    if (!prevCellChange) {
      throw new Error(
        `Cell change with id:${action.data.prevCellChangeId} not found!`
      );
    }
    const prevCellState = prevCellChange.studioState;

    // Set state to that from history
    cellState.studioState = prevCellState;

    // Update history
    const nextChangeId = cellState.changeHistory.currentChangeId;
    prevCellChange.nextChangeId.unshift(nextChangeId);
    cellState.changeHistory.currentChangeId = action.data.prevCellChangeId;

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default undoCellUpdate;
