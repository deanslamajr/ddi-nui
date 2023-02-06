import {
  AddEmojiAction,
  MoveEmojiAction,
  RedoCellAction,
  UndoCellAction,
  ResizeEmojiAction,
  RotateEmojiAction,
  FlipAndSkewEmojiAction,
  UpdateEmojisOrderAction,
  SetActiveEmojiAction,
  ToggleFilterAction,
  UpdateRGBAFilterAction,
  UpdateOpacityFilterAction,
} from "./types";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { KonvaFilters } from "~/utils/konva";

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

export const moveEmoji = (
  details:
    | {
        cellUrlId: string;
        diff: {
          x: number;
          y: number;
        };
      }
    | {
        cellUrlId: string;
        abs: {
          x: number;
          y: number;
        };
      }
): MoveEmojiAction => {
  if ("diff" in details) {
    return {
      type: "MOVE_EMOIJ",
      data: {
        cellUrlId: details.cellUrlId,
        diff: details.diff,
      },
    };
  } else {
    return {
      type: "MOVE_EMOIJ",
      data: {
        cellUrlId: details.cellUrlId,
        abs: details.abs,
      },
    };
  }
};

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

export const flipAndSkewEmoji = ({
  cellUrlId,
  newSkew,
  newScale,
}: {
  cellUrlId: string;
  newSkew: {
    x: number;
    y: number;
  };
  newScale: {
    x: number;
    y: number;
  };
}): FlipAndSkewEmojiAction => ({
  type: "FLIP_SKEW_EMOIJ",
  data: {
    cellUrlId,
    newSkew,
    newScale,
  },
});

export const updateEmojisOrder = ({
  cellUrlId,
  reorderedEmojis,
}: {
  cellUrlId: string;
  reorderedEmojis: Record<string, EmojiConfigSerialized>;
}): UpdateEmojisOrderAction => ({
  type: "REORDER_EMOIJS",
  data: {
    cellUrlId,
    reorderedEmojis,
  },
});

export const setActiveEmoji = ({
  cellUrlId,
  newActiveEmojiId,
}: {
  cellUrlId: string;
  newActiveEmojiId: number;
}): SetActiveEmojiAction => ({
  type: "SET_ACTIVE_EMOIJ",
  data: {
    cellUrlId,
    newActiveEmojiId,
  },
});

export const toggleActiveFilter = ({
  cellUrlId,
  filterType,
}: {
  cellUrlId: string;
  filterType: keyof KonvaFilters;
}): ToggleFilterAction => ({
  type: "TOGGLE_FILTER",
  data: {
    cellUrlId,
    filterType,
  },
});

export const updateRGBAFilter = ({
  cellUrlId,
  newFilterValues,
}: {
  cellUrlId: string;
  newFilterValues: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  };
}): UpdateRGBAFilterAction => ({
  type: "UPDATE_RGBA_FILTER",
  data: {
    cellUrlId,
    newFilterValues,
  },
});

export const updateOpacityFilter = ({
  cellUrlId,
  newOpacity,
}: {
  cellUrlId: string;
  newOpacity: number;
}): UpdateOpacityFilterAction => ({
  type: "UPDATE_OPACITY_FILTER",
  data: {
    cellUrlId,
    newOpacity,
  },
});
