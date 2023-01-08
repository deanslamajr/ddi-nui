import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji } from "~/contexts/ComicStudioState/actions";
import { StudioState } from "~/interfaces/studioState";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import EmojiCanvas, {
  EmojiRefs,
  links as emojiCanvasStylesUrl,
} from "./EmojiCanvas";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    ...emojiCanvasStylesUrl(),
    ...buttonStylesUrl(),
  ];
};

const CellStudio: React.FC<{
  cellUrlId: string;
  cellStudioState: StudioState;
  onShowEmojiPickerButtonClick: () => void;
}> = ({ cellStudioState, cellUrlId, onShowEmojiPickerButtonClick }) => {
  const [_, dispatch] = useComicStudioState();

  const emojiRefs = React.useRef({} as EmojiRefs);

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
    <>
      <EmojiCanvas
        activeEmojiId={cellStudioState.activeEmojiId}
        backgroundColor={cellStudioState.backgroundColor}
        emojiConfigs={Object.values(cellStudioState.emojis)}
        emojiRefs={emojiRefs.current}
        handleDragEnd={handleDragEnd}
      />
      <div>
        <MenuButton
          accented
          className="cell-studio-menu-button"
          onClick={() => onShowEmojiPickerButtonClick()}
        >
          +
        </MenuButton>
      </div>
    </>
  );
};

export default CellStudio;
