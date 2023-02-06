import { ComicStudioState, ComicStudioStateAction } from "../types";

import undoCellUpdate from "./undoCellUpdate";
import redoCellUpdate from "./redoCellUpdate";
import moveEmoji from "./moveEmoji";
import addEmoji from "./addEmoji";
import resizeEmoji from "./resizeEmoji";
import rotateEmoji from "./rotateEmoji";
import flipAndSkewEmoji from "./flipAndSkewEmoji";
import updateEmoijsOrder from "./updateEmojisOrder";
import setActiveEmoji from "./setActiveEmoji";
import toggleFilter from "./toggleFilter";
import updateRGBAFilter from "./updateRGBAFilter";
import updateOpacityFilter from "./updateOpacityFilter";

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
    case "ROTATE_EMOIJ":
      newState = rotateEmoji(state, action);
      break;
    case "FLIP_SKEW_EMOIJ":
      newState = flipAndSkewEmoji(state, action);
      break;
    case "REORDER_EMOIJS":
      newState = updateEmoijsOrder(state, action);
      break;
    case "SET_ACTIVE_EMOIJ":
      newState = setActiveEmoji(state, action);
      break;
    case "TOGGLE_FILTER":
      newState = toggleFilter(state, action);
      break;
    case "UPDATE_RGBA_FILTER":
      newState = updateRGBAFilter(state, action);
      break;
    case "UPDATE_OPACITY_FILTER":
      newState = updateOpacityFilter(state, action);
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
