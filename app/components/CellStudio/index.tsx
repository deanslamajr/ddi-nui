import React from "react";
import cloneDeep from "fast-clone";
import type { LinksFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";
import {
  createNewCell,
  doesCellUrlIdExist,
  setCellStudioState,
} from "~/utils/clientCache";
import { init, update } from "~/utils/studioStateMachine";

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
  initialStudioState: StudioState | null;
}> = ({ cellUrlId, initialStudioState }) => {
  const navigate = useNavigate();
  const [studioState, setStudioState] = React.useState<StudioState | null>(
    null
  );
  const emojiRefs = React.useRef({} as EmojiRefs);

  React.useEffect(() => {
    setStudioState(initialStudioState);
    init(initialStudioState);
  }, [initialStudioState, setStudioState]);

  const createNewComicAndCell = (initialStudioState: StudioState) => {
    // create new cell in cache
    const newCellFromClientCache = createNewCell({
      comicUrlId: undefined,
      initialStudioState,
    });

    const cellStudioUrl = DDI_APP_PAGES.cellStudio({
      cellUrlId: newCellFromClientCache.urlId,
    });
    navigate(cellStudioUrl, {
      state: { scroll: false },
    });
  };

  const saveStudioStateToCache = ({
    setHasNewImage = true,
    newStudioState = studioState!,
  }: { setHasNewImage?: boolean; newStudioState?: StudioState } = {}) => {
    if (!doesCellUrlIdExist(cellUrlId)) {
      createNewComicAndCell(newStudioState);
    } else {
      setCellStudioState(cellUrlId, newStudioState, {
        setHasNewImage,
      });
    }
  };

  const handleDragEnd = ({
    xDiff,
    yDiff,
  }: {
    xDiff: number;
    yDiff: number;
  }) => {
    setStudioState((prevStudioState) => {
      // This case should never occur as handleDragEnd is only ever used in EmojiCanvas
      // and EmojiCanvas will only render when prevStudioState !== null
      if (prevStudioState === null) {
        return null;
      }

      const newStudioState = update({
        type: "MOVE_EMOJI",
        emoijId: prevStudioState.activeEmojiId,
        data: {
          x: xDiff,
          y: yDiff,
        },
      });

      saveStudioStateToCache({ newStudioState });

      return newStudioState;
    });
  };

  return studioState !== null ? (
    <EmojiCanvas
      activeEmojiId={studioState.activeEmojiId}
      backgroundColor={studioState.backgroundColor}
      emojiConfigs={Object.values(studioState.emojis)}
      emojiRefs={emojiRefs.current}
      handleDragEnd={handleDragEnd}
    />
  ) : null;
};

export default CellStudio;
