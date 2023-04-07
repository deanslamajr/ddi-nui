import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { HydratedComic } from "~/utils/clientCache/comic";
import { KonvaFilters } from "~/utils/konva";

export type ComicStudioState = {
  comicState: HydratedComic;
};

export type ComicStudioContextValue =
  | [ComicStudioState, React.Dispatch<ComicStudioStateAction>]
  | undefined;

export type UndoCellAction = {
  type: "UNDO_CELL";
  data: {
    cellUrlId: string;
    prevCellChangeId: string;
  };
};

export type RedoCellAction = {
  type: "REDO_CELL";
  data: {
    cellUrlId: string;
    nextCellChangeId: string;
  };
};

export type MoveEmojiAction = {
  type: "MOVE_EMOIJ";
  data:
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
      };
};

export type AddEmojiAction = {
  type: "ADD_EMOIJ";
  data: {
    cellUrlId: string;
    newEmoji: string;
  };
};

export type ResizeEmojiAction = {
  type: "RESIZE_EMOIJ";
  data: {
    cellUrlId: string;
    newSize: number;
    shouldSaveChange: boolean;
  };
};

export type RotateEmojiAction = {
  type: "ROTATE_EMOIJ";
  data: {
    cellUrlId: string;
    newRotation: number;
    shouldSaveChange: boolean;
  };
};

export type FlipAndSkewEmojiAction = {
  type: "FLIP_SKEW_EMOIJ";
  data: {
    cellUrlId: string;
    newSkew: {
      x: number;
      y: number;
    };
    newScale: {
      x: number;
      y: number;
    };
  };
};

export type UpdateEmojisOrderAction = {
  type: "REORDER_EMOIJS";
  data: {
    cellUrlId: string;
    reorderedEmojis: Record<string, EmojiConfigSerialized>;
  };
};

export type SetActiveEmojiAction = {
  type: "SET_ACTIVE_EMOIJ";
  data: {
    cellUrlId: string;
    newActiveEmojiId: number;
  };
};

export type ToggleFilterAction = {
  type: "TOGGLE_FILTER";
  data: {
    cellUrlId: string;
    filterType: keyof KonvaFilters;
  };
};

export type UpdateRGBAFilterAction = {
  type: "UPDATE_RGBA_FILTER";
  data: {
    cellUrlId: string;
    newFilterValues: {
      red: number;
      green: number;
      blue: number;
      alpha: number;
    };
  };
};

export type UpdateOpacityFilterAction = {
  type: "UPDATE_OPACITY_FILTER";
  data: {
    cellUrlId: string;
    newOpacity: number;
  };
};

export type UpdateCellCaptionAction = {
  type: "UPDATE_CELL_CAPTION";
  data: { caption: string; cellUrlId: string };
};

export type ComicStudioStateAction =
  | UndoCellAction
  | RedoCellAction
  | MoveEmojiAction
  | AddEmojiAction
  | ResizeEmojiAction
  | RotateEmojiAction
  | FlipAndSkewEmojiAction
  | UpdateEmojisOrderAction
  | SetActiveEmojiAction
  | ToggleFilterAction
  | UpdateRGBAFilterAction
  | UpdateOpacityFilterAction
  | UpdateCellCaptionAction;

export type ComicStudioStateReducer<T extends ComicStudioStateAction> = (
  comicStudioState: ComicStudioState,
  action: T
) => ComicStudioState;
