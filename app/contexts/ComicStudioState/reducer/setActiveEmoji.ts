import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, SetActiveEmojiAction } from "../types";
import { getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const addEmoji: ComicStudioStateReducer<SetActiveEmojiAction> = (
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

    cellState.studioState.activeEmojiId = action.data.newActiveEmojiId;
    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default addEmoji;
