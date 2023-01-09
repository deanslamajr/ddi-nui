import { ComicStudioState, ComicStudioStateAction } from "../types";

import undoCellUpdate from "./undoCellUpdate";
import redoCellUpdate from "./redoCellUpdate";
import moveEmoji from "./moveEmoji";
import addEmoji from "./addEmoji";
import resizeEmoji from "./resizeEmoji";

import { getCache, setCache, ClientCache } from "~/utils/clientCache";

import { ComicFromClientCache } from "~/utils/clientCache/comic";

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
    case "UNDO_CELL":
      newState = undoCellUpdate(state, action);
      break;
    case "REDO_CELL":
      newState = redoCellUpdate(state, action);
      break;
    case "MOVE_EMOIJ":
      newState = moveEmoji(state, action);
      break;
    case "ADD_EMOIJ":
      newState = addEmoji(state, action);
      break;
    case "RESIZE_EMOIJ":
      newState = resizeEmoji(state, action);
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
