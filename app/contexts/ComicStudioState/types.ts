import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { HydratedComic } from "~/utils/clientCache/comic";

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

export type ComicStudioStateAction =
  | UndoCellAction
  | RedoCellAction
  | MoveEmojiAction
  | AddEmojiAction
  | ResizeEmojiAction
  | RotateEmojiAction
  | FlipAndSkewEmojiAction
  | UpdateEmojisOrderAction;

export type ComicStudioStateReducer<T extends ComicStudioStateAction> = (
  comicStudioState: ComicStudioState,
  action: T
) => ComicStudioState;
