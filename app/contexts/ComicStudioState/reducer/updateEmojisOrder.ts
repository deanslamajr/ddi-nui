import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, UpdateEmojisOrderAction } from "../types";
import { getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const updateEmojisOrder: ComicStudioStateReducer<UpdateEmojisOrderAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error(
        `Cell state not found for cellUrlId:${action.data.cellUrlId}!`
      );
    }

    cellState.studioState.emojis = action.data.reorderedEmojis;

    cellState.isDirty = true;
    cellState.hasNewImage = true;

    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default updateEmojisOrder;
