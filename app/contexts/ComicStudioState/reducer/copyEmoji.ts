import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, CopyEmojiAction } from "../types";
import { getCellState } from "../selectors";
import { StudioState } from "~/interfaces/studioState";
import { createNewEmojiComponentState } from "~/models/emojiConfig";
import { addNewCellChangeToHistory } from "~/models/cellChange";

const copyEmojiConfigAndUpdateStudioState = (
  clonedStudioState: StudioState,
  emojiIdToCopy: number
): void => {
  const currentEmojiId = clonedStudioState.currentEmojiId;
  const clonedEmojis = clonedStudioState.emojis;
  const clonedEmojiToCopy = cloneDeep(clonedEmojis[emojiIdToCopy]);

  const newEmoji = createNewEmojiComponentState(
    clonedEmojiToCopy.emoji,
    currentEmojiId,
    clonedEmojiToCopy
  );
  clonedEmojis[newEmoji.id] = newEmoji;

  clonedStudioState.activeEmojiId = newEmoji.id;
  clonedStudioState.currentEmojiId = currentEmojiId + 1;
};

const copyEmoji: ComicStudioStateReducer<CopyEmojiAction> = (state, action) => {
  try {
    const clonedState = cloneDeep(state);

    const cellState = getCellState(clonedState, action.data.cellUrlId);
    if (!cellState || !cellState.studioState) {
      throw new Error(
        `Cell state not found for cellUrlId:${action.data.cellUrlId}!`
      );
    }

    const emojiIdToCopy =
      typeof action.data.emojiId === "number"
        ? action.data.emojiId
        : cellState.studioState.activeEmojiId;
    if (emojiIdToCopy === null) {
      return state;
    }

    cellState.isDirty = true;

    copyEmojiConfigAndUpdateStudioState(cellState.studioState, emojiIdToCopy);
    addNewCellChangeToHistory(cellState);

    return clonedState;
  } catch (e) {
    console.error(e);
    return state;
  }
};

export default copyEmoji;
