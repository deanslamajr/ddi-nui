import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, ToggleFilterAction } from "../types";
import { getActiveEmoji, getCellState } from "../selectors";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const toggleFilter: ComicStudioStateReducer<ToggleFilterAction> = (
  state,
  action
) => {
  try {
    const clonedState = cloneDeep(state);

    const activeEmoji = getActiveEmoji(clonedState, action.data.cellUrlId);
    if (!activeEmoji) {
      throw new Error("Active Emoji not found!");
    }

    if (action.data.filterType === "RGBA") {
      if (activeEmoji.filters?.includes("RGBA")) {
        activeEmoji.filters = activeEmoji.filters.filter((f) => f !== "RGBA");
      } else {
        activeEmoji.filters = [...(activeEmoji.filters || []), "RGBA"];
      }
    }

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

export default toggleFilter;
