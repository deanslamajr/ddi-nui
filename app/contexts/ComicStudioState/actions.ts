import {
  AddEmojiAction,
  MoveEmojiAction,
  RedoCellAction,
  UndoCellAction,
} from "./types";

export const moveEmoji = ({
  cellUrlId,
  emojiId,
  xDiff,
  yDiff,
}: {
  cellUrlId: string;
  emojiId: number;
  xDiff: number;
  yDiff: number;
}): MoveEmojiAction => ({
  type: "MOVE_EMOIJ",
  data: {
    cellUrlId,
    emojiId,
    xDiff,
    yDiff,
  },
});

export const addEmoji = ({
  newEmoji,
  cellUrlId,
}: {
  newEmoji: string;
  cellUrlId: string;
}): AddEmojiAction => ({
  type: "ADD_EMOIJ",
  data: {
    newEmoji,
    cellUrlId,
  },
});

export const undoCellUpdate = ({
  cellUrlId,
  prevCellChangeId,
}: {
  cellUrlId: string;
  prevCellChangeId: string;
}): UndoCellAction => ({
  type: "UNDO_CELL",
  data: {
    cellUrlId,
    prevCellChangeId,
  },
});

export const redoCellUpdate = ({
  cellUrlId,
  nextCellChangeId,
}: {
  cellUrlId: string;
  nextCellChangeId: string;
}): RedoCellAction => ({
  type: "REDO_CELL",
  data: {
    cellUrlId,
    nextCellChangeId,
  },
});
