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

export type FlipEmojiAction = {
  type: "FLIP_EMOIJ";
  data: {
    cellUrlId: string;
    type: "HORIZONTAL" | "VERTICAL";
  };
};

export type SkewEmojiAction = {
  type: "SKEW_EMOIJ";
  data: {
    cellUrlId: string;
    newSkewValue: number;
    type: "HORIZONTAL" | "VERTICAL";
    shouldSaveChange: boolean;
  };
};

export type ComicStudioStateAction =
  | UndoCellAction
  | RedoCellAction
  | MoveEmojiAction
  | AddEmojiAction
  | ResizeEmojiAction
  | RotateEmojiAction
  | FlipEmojiAction
  | SkewEmojiAction;

export type ComicStudioStateReducer<T extends ComicStudioStateAction> = (
  comicStudioState: ComicStudioState,
  action: T
) => ComicStudioState;
