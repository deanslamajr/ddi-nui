import {
  AddEmojiAction,
  MoveEmojiAction,
  RedoCellAction,
  UndoCellAction,
  ResizeEmojiAction,
  RotateEmojiAction,
  FlipEmojiAction,
  SkewEmojiAction,
} from "./types";

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

export const moveEmoji = ({
  cellUrlId,
  xDiff,
  yDiff,
}: {
  cellUrlId: string;
  xDiff: number;
  yDiff: number;
}): MoveEmojiAction => ({
  type: "MOVE_EMOIJ",
  data: {
    cellUrlId,
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

export const resizeEmoji = ({
  newSize,
  cellUrlId,
  shouldSaveChange,
}: {
  newSize: number;
  cellUrlId: string;
  shouldSaveChange: boolean;
}): ResizeEmojiAction => ({
  type: "RESIZE_EMOIJ",
  data: {
    newSize,
    cellUrlId,
    shouldSaveChange,
  },
});

export const rotateEmoji = ({
  newRotation,
  cellUrlId,
  shouldSaveChange,
}: {
  newRotation: number;
  cellUrlId: string;
  shouldSaveChange: boolean;
}): RotateEmojiAction => ({
  type: "ROTATE_EMOIJ",
  data: {
    newRotation,
    cellUrlId,
    shouldSaveChange,
  },
});

export const flipEmoji = ({
  cellUrlId,
  type,
}: {
  cellUrlId: string;
  type: "HORIZONTAL" | "VERTICAL";
}): FlipEmojiAction => ({
  type: "FLIP_EMOIJ",
  data: {
    cellUrlId,
    type,
  },
});

export const skewEmoji = ({
  cellUrlId,
  type,
  newSkewValue,
  shouldSaveChange,
}: {
  cellUrlId: string;
  type: "HORIZONTAL" | "VERTICAL";
  newSkewValue: number;
  shouldSaveChange: boolean;
}): SkewEmojiAction => ({
  type: "SKEW_EMOIJ",
  data: {
    cellUrlId,
    type,
    newSkewValue,
    shouldSaveChange,
  },
});
