import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { MdOutlineOpacity } from "react-icons/md";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { updateOpacityFilter } from "~/contexts/ComicStudioState/actions";
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
    ...emojiCanvasStylesUrl(),
    ...buttonStylesUrl(),
    ...sliderStylesUrl(),
    ...dPadStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const OpacityMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [state, setState] = React.useState<{
    localOpacity: number;
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    const activeEmoji = clonedEmojiConfigs[activeEmojiId];
    return {
      localOpacity: activeEmoji.opacity || EMOJI_CONFIG.MAX_OPACITY,
      localEmojiConfigs: clonedEmojiConfigs,
    };
  });

  const setLocalOpacity = (newOpacity: number): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newEmojiConfigs = { ...prevState!.localEmojiConfigs };
      newEmojiConfigs[activeEmojiId!] = {
        ...prevActiveEmoji,
        opacity: newOpacity,
      };

      return {
        localOpacity: newOpacity,
        localEmojiConfigs: newEmojiConfigs,
      };
    });
  };

  const saveAndGoBack = () => {
    if (state) {
      dispatch(
        updateOpacityFilter({
          newOpacity: state.localOpacity,
          cellUrlId,
        })
      );
    }
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
      {state !== null ? (
        <div className="submenu-slider-container">
          <span className="submenu-label">
            <MdOutlineOpacity color={theme.colors.pink} size="2rem" />
          </span>
          <Slider
            min={EMOJI_CONFIG.MIN_OPACITY}
            max={EMOJI_CONFIG.MAX_OPACITY}
            step={0.1}
            value={state.localOpacity}
            onChange={(value) => setLocalOpacity(value)}
            onRelease={(value) => setLocalOpacity(value)}
          />
          <DPad
            horizontalActions={(multiplier) => ({
              onLeftClick: () => {
                let newValue = state.localOpacity - 0.01 * multiplier;
                if (newValue <= 0) {
                  newValue = 0;
                }
                setLocalOpacity(newValue);
              },
              onRightClick: () =>
                setLocalOpacity(state.localOpacity + 0.01 * multiplier),
            })}
          />
        </div>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default OpacityMenu;
