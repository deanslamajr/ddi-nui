import { MoveEmojiAction, UndoCellAction } from "./types";

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
