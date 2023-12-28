import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, SetActiveEmojiAction } from "../types";
import { getCellState } from "../selectors";

const setActiveEmoji: ComicStudioStateReducer<SetActiveEmojiAction> = (
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

    let nextSelectedEmojiIds = [] as number[];

    if (action.data.isBulkSelect) {
      if (
        cellState.studioState.selectedEmojiIds?.includes(
          action.data.newActiveEmojiId
        )
      ) {
        nextSelectedEmojiIds = cellState.studioState.selectedEmojiIds.filter(
          (prevSelectedId) => prevSelectedId !== action.data.newActiveEmojiId
        );
      } else {
        nextSelectedEmojiIds = Array.from(
          cellState.studioState.selectedEmojiIds || []
        );
        nextSelectedEmojiIds.push(action.data.newActiveEmojiId);
      }
    } else {
      nextSelectedEmojiIds.push(action.data.newActiveEmojiId);
      // @TODO - deprecate activeEmojiId if it is redundant AFTER implementation
      //         of the selectedEmojiIds feature set (i.e. bulk select)
      cellState.studioState.activeEmojiId = action.data.newActiveEmojiId;
    }

    cellState.studioState.selectedEmojiIds = nextSelectedEmojiIds;
    // const prevSelectedEmojiIds = Array.from(
    //   cellState.studioState.selectedEmojiIds || []
    // );

    // .reduce((acc, selectedId) => {
    //   if (selectedId !== action.data.newActiveEmojiId) {
    //     acc.push(selectedId);
    //   }
    //   return acc;
    // }, [] as number[]);

    console.log(
      "setActiveEmoji cellState.studioState.selectedEmojiIds",
      cellState.studioState.selectedEmojiIds
    );

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default setActiveEmoji;
