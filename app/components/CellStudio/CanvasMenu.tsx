import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { GiPaintBucket } from "react-icons/gi";
import { RgbaStringColorPicker } from "react-colorful";
import { colord } from "colord";

import { theme } from "~/utils/stylesTheme";
import { DEFAULT_STUDIO_STATE } from "~/utils/validators";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { updateBackgroundColor } from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiCanvas, {
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...emojiCanvasStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const CanvasMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [localBackgroundColor, setLocalBackgroundColor] = React.useState<
    string | null
  >(() => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    return colord(
      cellStudioState.backgroundColor || DEFAULT_STUDIO_STATE.backgroundColor
    ).toRgbString();
  });

  const saveAndGoBack = () => {
    if (localBackgroundColor) {
      const newBackgroundColorHex = colord(localBackgroundColor).toHex();

      dispatch(
        updateBackgroundColor({
          cellUrlId,
          newBackgroundColor: newBackgroundColorHex,
        })
      );
    }
    onBackButtonClick();
  };

  return (
    <>
      {cellStudioState && localBackgroundColor && (
        <EmojiCanvas
          activeEmojiId={activeEmojiId}
          backgroundColor={localBackgroundColor}
          emojiConfigs={cellStudioState.emojis}
          isDraggable={false}
        />
      )}
      <BackMenuButton onBackButtonClick={saveAndGoBack} />
      {localBackgroundColor !== null ? (
        <div className="submenu-slider-container">
          <span className="submenu-label">
            <GiPaintBucket color={theme.colors.pink} size="2rem" />
          </span>
          <RgbaStringColorPicker
            color={localBackgroundColor}
            onChange={(newBackgroundColor) => {
              setLocalBackgroundColor(newBackgroundColor);
            }}
          />
        </div>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default CanvasMenu;
