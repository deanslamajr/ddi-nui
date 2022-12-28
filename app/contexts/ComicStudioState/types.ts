import { HydratedComic } from "~/utils/clientCache";

export type ComicStudioState = {
  comicState: HydratedComic;
  changeHistory: ChangeHistory;
};

export type ComicStudioContextValue =
  | [ComicStudioState, React.Dispatch<ComicStudioStateAction>]
  | undefined;

export type MoveUpdateDetails = {
  type: "MOVE";
  data: {
    cellUrlId: string;
    emojiId: number;
    xDiff: number;
    yDiff: number;
  };
};

export type RotateUpdateDetails = {
  type: "ROTATE";
  data: {
    beef: string;
  }; // @TODO fill out real type
};

export type ComicStudioStateAction = MoveUpdateDetails | RotateUpdateDetails;

export type ChangeDetail = {
  id: string;
  previousChangeDetailId: string | null;
  nextChangeDetailId: string | null;
  action: ComicStudioStateAction;
};

export type ChangeHistory = {
  headDetailId: string | null;
  changeDetails: Record<string, ChangeDetail>;
};

export type ComicStudioStateReducer<T extends ComicStudioStateAction> = (
  comicStudioState: ComicStudioState,
  action: T,
  isUndo?: boolean
) => ComicStudioState;
