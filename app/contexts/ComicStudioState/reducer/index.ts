import {
  ChangeDetail,
  ComicStudioState,
  ComicStudioStateAction,
} from "../types";
import moveEmoji from "./moveEmoji";

export const initialState: ComicStudioState = {
  comicState: {
    initialCellUrlId: null,
    lastModified: 0,
    urlId: "",
    cells: {},
  },
  changeHistory: {
    headDetailId: null,
    changeDetails: {} as Record<string, ChangeDetail>,
  },
};

export const reducer = (
  state = initialState,
  action: ComicStudioStateAction
): ComicStudioState => {
  switch (action.type) {
    case "MOVE":
      return moveEmoji(state, action);
    default:
      console.warn("StudioState: unknown action has been dispatched!");
      return state;
  }
};
