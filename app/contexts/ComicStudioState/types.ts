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
  data: {
    cellUrlId: string;
    emojiId: number;
    xDiff: number;
    yDiff: number;
  };
};

export type AddEmojiAction = {
  type: "ADD_EMOIJ";
  data: {
    cellUrlId: string;
    newEmoji: string;
  };
};

export type ComicStudioStateAction =
  | UndoCellAction
  | RedoCellAction
  | MoveEmojiAction
  | AddEmojiAction;

export type ComicStudioStateReducer<T extends ComicStudioStateAction> = (
  comicStudioState: ComicStudioState,
  action: T
) => ComicStudioState;
