import React from "react";
import cloneDeep from "fast-clone";
import type { LinksFunction } from "@remix-run/node";

import { DDI_APP_PAGES } from "~/utils/urls";
import { HydratedComic, getDirtyComics } from "~/utils/clientCache";

import { StudioState } from "~/interfaces/studioState";

import EmojiCanvas, {
  EmojiRefs,
  links as emojiCanvasStylesUrl,
} from "./EmojiCanvas";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }, ...emojiCanvasStylesUrl()];
};

const CellStudio: React.FC<{ initialStudioState: StudioState | null }> = ({
  initialStudioState,
}) => {
  const [studioState, setStudioState] = React.useState<StudioState | null>(
    null
  );
  const emojiRefs = React.useRef({} as EmojiRefs);

  React.useEffect(() => {
    setStudioState(initialStudioState);
  }, [initialStudioState, setStudioState]);

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

      const activeEmojiId = prevStudioState.activeEmojiId;
      const clonedStudioState = cloneDeep(prevStudioState);
      const clonedEmojis = clonedStudioState.emojis;
      const activeEmoji = clonedEmojis[activeEmojiId];

      clonedEmojis[activeEmojiId].x = activeEmoji.x + xDiff;
      clonedEmojis[activeEmojiId].y = activeEmoji.y + yDiff;

      return clonedStudioState;
    });

    // saveStudioStateToCache();
  };

  console.log("studioState", studioState);

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
