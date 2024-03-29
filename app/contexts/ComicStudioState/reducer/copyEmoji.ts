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
  const clonedEmojis = clonedStudioState.emojis;
  const clonedEmojiToCopy = cloneDeep(clonedEmojis[emojiIdToCopy]);

  const newEmojiId = Object.keys(clonedEmojis).length
    ? Math.max(...Object.keys(clonedEmojis).map((emojiId) => Number(emojiId))) +
      1
    : 1;

  // cloned emoji shold have order set to that immediately above copied emoji
  // if collisions of emoji id, increment emoji id's
  const newEmojiOrder = clonedEmojiToCopy.order + 1;
  const newEmoji = createNewEmojiComponentState({
    emoji: clonedEmojiToCopy.emoji,
    id: newEmojiId,
    order: newEmojiOrder,
    emojiConfigTemplate: clonedEmojiToCopy,
  });

  clonedEmojis[newEmoji.id] = newEmoji;
  let nextEmoji = newEmoji;
  do {
    nextEmoji = Object.values(clonedEmojis).find(
      (ce) => ce.id !== nextEmoji.id && ce.order === nextEmoji.order
    )!; // this should always exist bc we checked it in the outer loop
    if (nextEmoji && typeof nextEmoji.order === "number") {
      nextEmoji.order++;
    }
  } while (nextEmoji);

  clonedStudioState.activeEmojiId = newEmoji.id;
  clonedStudioState.currentEmojiId = newEmojiId;
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
