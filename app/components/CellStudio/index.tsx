import React from "react";
import type { LinksFunction } from "@remix-run/node";
// import { useNavigate } from "@remix-run/react";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji } from "~/contexts/ComicStudioState/actions";

// import { DDI_APP_PAGES } from "~/utils/urls";
// import {
//   createNewCell,
//   doesCellUrlIdExist,
//   setCellStudioState,
// } from "~/utils/clientCache";
// import { init, update } from "~/utils/studioStateMachine";

import { StudioState } from "~/interfaces/studioState";

import EmojiCanvas, {
  EmojiRefs,
  links as emojiCanvasStylesUrl,
} from "./EmojiCanvas";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }, ...emojiCanvasStylesUrl()];
};

const CellStudio: React.FC<{
  cellUrlId: string;
  cellStudioState: StudioState;
}> = ({ cellStudioState, cellUrlId }) => {
  // const navigate = useNavigate();

  const [_, dispatch] = useComicStudioState();

  const emojiRefs = React.useRef({} as EmojiRefs);

  // const createNewComicAndCell = (initialStudioState: StudioState) => {
  //   // create new cell in cache
  //   const newCellFromClientCache = createNewCell({
  //     comicUrlId: undefined,
  //     initialStudioState,
  //   });

  //   const cellStudioUrl = DDI_APP_PAGES.cellStudio({
  //     cellUrlId: newCellFromClientCache.urlId,
  //   });
  //   navigate(cellStudioUrl, {
  //     state: { scroll: false },
  //   });
  // };

  // const saveStudioStateToCache = ({
  //   setHasNewImage = true,
  //   newStudioState = studioState!,
  // }: { setHasNewImage?: boolean; newStudioState?: StudioState } = {}) => {
  //   if (!doesCellUrlIdExist(cellUrlId)) {
  //     createNewComicAndCell(newStudioState);
  //   } else {
  //     setCellStudioState(cellUrlId, newStudioState, {
  //       setHasNewImage,
  //     });
  //   }
  // };

  const handleDragEnd = ({
    xDiff,
    yDiff,
  }: {
    xDiff: number;
    yDiff: number;
  }) => {
    dispatch(
      moveEmoji({
        cellUrlId,
        emojiId: cellStudioState.activeEmojiId,
        xDiff,
        yDiff,
      })
    );
  };

  return (
    <EmojiCanvas
      activeEmojiId={cellStudioState.activeEmojiId}
      backgroundColor={cellStudioState.backgroundColor}
      emojiConfigs={Object.values(cellStudioState.emojis)}
      emojiRefs={emojiRefs.current}
      handleDragEnd={handleDragEnd}
    />
  );
};

export default CellStudio;
