import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, AddEmojiAction } from "../types";
import { getCellState } from "../selectors";
import { StudioState } from "~/interfaces/studioState";
import { addNewCellChangeToHistory } from "~/models/cellChange";
import { createNewEmojiComponentState } from "~/models/emojiConfig";
import { DEFAULT_STUDIO_STATE } from "~/utils/validators";

const createNewEmojiConfigAndUpdateStudioState = (
  clonedStudioState: StudioState,
  action: Parameters<ComicStudioStateReducer<AddEmojiAction>>[1]
): void => {
  const currentEmojiId = clonedStudioState.currentEmojiId;
  const clonedEmojis = clonedStudioState.emojis;

  const newEmoji = createNewEmojiComponentState(
    action.data.newEmoji,
    typeof currentEmojiId === "number"
      ? currentEmojiId
      : DEFAULT_STUDIO_STATE.currentEmojiId
  );
  clonedEmojis[newEmoji.id] = newEmoji;

  clonedStudioState.activeEmojiId = newEmoji.id;
  clonedStudioState.currentEmojiId =
    typeof currentEmojiId === "number"
      ? currentEmojiId + 1
      : DEFAULT_STUDIO_STATE.currentEmojiId + 1;
};

const addEmoji: ComicStudioStateReducer<AddEmojiAction> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error(
        `Cell state not found for cellUrlId:${action.data.cellUrlId}!`
      );
    }

    cellState.isDirty = true;
    cellState.hasNewImage = true;

    createNewEmojiConfigAndUpdateStudioState(cellState.studioState, action);
    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default addEmoji;
