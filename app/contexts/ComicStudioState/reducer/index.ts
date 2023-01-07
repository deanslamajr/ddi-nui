import { ComicStudioState, ComicStudioStateAction } from "../types";
import moveEmoji from "./moveEmoji";
import undoCellUpdate from "./undoCellUpdate";
import redoCellUpdate from "./redoCellUpdate";
import {
  getCache,
  setCache,
  ClientCache,
  ComicFromClientCache,
} from "~/utils/clientCache";

export const initialState: ComicStudioState = {
  comicState: {
    initialCellUrlId: null,
    lastModified: 0,
    urlId: "",
    cells: {},
  },
};

const persistStateToClientCache = (comicStudioState: ComicStudioState) => {
  const cells = comicStudioState.comicState.cells
    ? comicStudioState.comicState.cells
    : {};
  const comic: ComicFromClientCache = {
    initialCellUrlId: comicStudioState.comicState.initialCellUrlId,
    lastModified: comicStudioState.comicState.lastModified,
    urlId: comicStudioState.comicState.urlId,
  };

  const prevCache = getCache();
  const comics = prevCache.comics;
  comics[comic.urlId] = comic;

  const clientCache: ClientCache = {
    cells,
    comics,
  };

  setCache(clientCache);
};

export const reducer = (
  state = initialState,
  action: ComicStudioStateAction
): ComicStudioState => {
  let newState = state;

  switch (action.type) {
    case "MOVE_EMOIJ":
      newState = moveEmoji(state, action);
      break;
    case "UNDO_CELL":
      newState = undoCellUpdate(state, action);
      break;
    case "REDO_CELL":
      newState = redoCellUpdate(state, action);
      break;
    default:
      console.warn("StudioState: unknown action has been dispatched!");
  }

  // persist state to client cache if there is actually a change
  if (newState !== state) {
    persistStateToClientCache(newState);
  }

  return newState;
};
