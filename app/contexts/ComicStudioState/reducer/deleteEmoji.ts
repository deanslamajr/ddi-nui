import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, DeleteEmojiAction } from "../types";
import { getCellState } from "../selectors";
import { StudioState } from "~/interfaces/studioState";
import { addNewCellChangeToHistory } from "~/models/cellChange";
import { DEFAULT_STUDIO_STATE } from "~/utils/validators";

const deleteEmojiConfigAndUpdateStudioState = (
  clonedStudioState: StudioState,
  emojiIdToDelete: number
): void => {
  const clonedEmojis = clonedStudioState.emojis;

  delete clonedEmojis[emojiIdToDelete];

  const clonedEmojisValues = Object.values(clonedEmojis);
  let newActiveEmojiId: StudioState["activeEmojiId"];
  // if this deletes the last emoji
  if (!clonedEmojisValues.length) {
    clonedStudioState.activeEmojiId = null;
    clonedStudioState.currentEmojiId = DEFAULT_STUDIO_STATE.currentEmojiId;
  } else {
    newActiveEmojiId = clonedEmojisValues[emojiIdToDelete + 1]
      ? clonedEmojisValues[emojiIdToDelete + 1].id
      : clonedEmojisValues[emojiIdToDelete - 1]
      ? clonedEmojisValues[emojiIdToDelete - 1].id
      : clonedEmojisValues[0].id;
    clonedStudioState.currentEmojiId = newActiveEmojiId;
    clonedStudioState.activeEmojiId = newActiveEmojiId;
  }
};

const deleteEmoji: ComicStudioStateReducer<DeleteEmojiAction> = (
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

    const emojiIdToDelete =
      typeof action.data.emojiId === "number"
        ? action.data.emojiId
        : cellState.studioState.activeEmojiId;
    if (emojiIdToDelete === null) {
      return state;
    }

    cellState.isDirty = true;

    deleteEmojiConfigAndUpdateStudioState(
      cellState.studioState,
      emojiIdToDelete
    );
    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default deleteEmoji;
