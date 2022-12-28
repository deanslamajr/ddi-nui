import cloneDeep from "fast-clone";

import { ComicStudioStateReducer, MoveUpdateDetails } from "../types";
import { getCellState } from "../selectors";
import addNewChangeToHistory from "./addNewChangeToHistory";

const updateComicStudioState = (
  comicStudioState: Parameters<ComicStudioStateReducer<MoveUpdateDetails>>[0],
  action: Parameters<ComicStudioStateReducer<MoveUpdateDetails>>[1],
  isUndo?: Parameters<ComicStudioStateReducer<MoveUpdateDetails>>[2]
): void => {
  const cellState = getCellState(comicStudioState, action.data.cellUrlId);
  if (!cellState || !cellState.studioState) {
    throw new Error("Cell state not found!");
  }

  const emojis = cellState.studioState.emojis;
  const activeEmojiId = action.data.emojiId;
  const activeEmoji = emojis[activeEmojiId];

  if (isUndo) {
    emojis[activeEmojiId].x = activeEmoji.x - action.data.xDiff;
    emojis[activeEmojiId].y = activeEmoji.y - action.data.yDiff;
  } else {
    emojis[activeEmojiId].x = activeEmoji.x + action.data.xDiff;
    emojis[activeEmojiId].y = activeEmoji.y + action.data.yDiff;
  }
};

const moveEmoji: ComicStudioStateReducer<MoveUpdateDetails> = (
  state,
  action,
  isUndo
) => {
  try {
    const clonedState = cloneDeep(state);

    updateComicStudioState(clonedState, action);
    addNewChangeToHistory(clonedState, action);

    return clonedState;
  } catch (e) {
    return state;
  }
};

export default moveEmoji;
