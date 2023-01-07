import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, RedoCellAction } from "../types";
import { getCellState } from "../selectors";

const redoCellUpdate: ComicStudioStateReducer<RedoCellAction> = (
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

    const nextCellChange =
      cellState.changeHistory.changes[action.data.nextCellChangeId];
    if (!nextCellChange) {
      throw new Error(
        `Cell change with id:${action.data.nextCellChangeId} not found!`
      );
    }
    const nextCellState = nextCellChange.studioState;

    // Set state to that from history
    cellState.studioState = nextCellState;

    // Update history
    cellState.changeHistory.currentChangeId = action.data.nextCellChangeId;

    return clonedState;
  } catch (e) {
    return state;
  }
};

export default redoCellUpdate;
