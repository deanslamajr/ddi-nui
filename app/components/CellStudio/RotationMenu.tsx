import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { TbRotate360 } from "react-icons/tb";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { rotateEmoji } from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import Slider, { links as sliderStylesUrl } from "~/components/Slider";
import DPad, { links as dPadStylesUrl } from "~/components/DPad";
import EmojiCanvas, {
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...sliderStylesUrl(),
    ...dPadStylesUrl(),
    ...emojiCanvasStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const RotationMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [state, setState] = React.useState<{
    localRotation: number;
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    const activeEmoji = clonedEmojiConfigs[activeEmojiId];
    return {
      localRotation: activeEmoji.rotation,
      localEmojiConfigs: clonedEmojiConfigs,
    };
  });

  const rotateLocalEmoji = (newRotation: number): void => {
    setState((prevState) => {
      const activeEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!activeEmoji) {
        return prevState;
      }
      activeEmoji.rotation = newRotation;

      return {
        localRotation: newRotation,
        localEmojiConfigs: prevState!.localEmojiConfigs,
      };
    });
  };

  const saveAndGoBack = () => {
    dispatch(
      rotateEmoji({
        newRotation: state!.localRotation,
        cellUrlId,
        shouldSaveChange: true,
      })
    );
    onBackButtonClick();
  };

  return (
    <>
      {cellStudioState && state && (
        <EmojiCanvas
          activeEmojiId={activeEmojiId}
          backgroundColor={cellStudioState.backgroundColor}
          emojiConfigs={state.localEmojiConfigs}
          isDraggable={false}
        />
      )}
      <BackMenuButton onBackButtonClick={saveAndGoBack} />
      {state!.localRotation !== null ? (
        <div className="submenu-slider-container">
          <span className="submenu-label">
            <TbRotate360 color={theme.colors.pink} size="2rem" />
          </span>
          <Slider
            min={EMOJI_CONFIG.MIN_ROTATION}
            max={EMOJI_CONFIG.MAX_ROTATION}
            step={1}
            value={state!.localRotation}
            onChange={(value) => rotateLocalEmoji(value)}
            onRelease={(value) => rotateLocalEmoji(value)}
          />
          <DPad
            horizontalActions={(multiplier) => ({
              onLeftClick: () =>
                rotateLocalEmoji(state!.localRotation - multiplier),
              onRightClick: () =>
                rotateLocalEmoji(state!.localRotation + multiplier),
            })}
          />
        </div>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default RotationMenu;
