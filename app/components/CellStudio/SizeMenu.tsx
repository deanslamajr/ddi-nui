import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { GiResize } from "react-icons/gi";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji, resizeEmoji } from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
  getEmojiPosition,
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

const SizeMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);
  const emojiPosition = getEmojiPosition(comicStudioState, cellUrlId);

  const renderState = () => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    const activeEmoji = clonedEmojiConfigs[activeEmojiId];
    return {
      localSize: activeEmoji.size,
      localEmojiConfigs: clonedEmojiConfigs,
    };
  };

  const [state, setState] = React.useState<{
    localSize: number;
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    return renderState();
  });

  React.useEffect(() => {
    setState(renderState());
  }, [emojiPosition?.x, emojiPosition?.y]);

  const resizeLocalEmoji = (newSize: number): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newEmojiConfigs = { ...prevState!.localEmojiConfigs };
      newEmojiConfigs[activeEmojiId!] = {
        ...prevActiveEmoji,
        size: newSize,
      };

      return {
        localSize: newSize,
        localEmojiConfigs: newEmojiConfigs,
      };
    });
  };

  const saveAndGoBack = () => {
    dispatch(
      resizeEmoji({
        newSize: state!.localSize,
        cellUrlId,
        shouldSaveChange: true,
      })
    );
    onBackButtonClick();
  };

  const handleDragEnd = ({
    xDiff,
    yDiff,
  }: {
    xDiff: number;
    yDiff: number;
  }): void => {
    dispatch(
      resizeEmoji({
        newSize: state!.localSize,
        cellUrlId,
        shouldSaveChange: true,
      })
    );
    dispatch(
      moveEmoji({
        diff: {
          x: xDiff,
          y: yDiff,
        },
        cellUrlId,
      })
    );
  };

  return (
    <>
      {cellStudioState && state && (
        <EmojiCanvas
          activeEmojiId={activeEmojiId}
          backgroundColor={cellStudioState.backgroundColor}
          emojiConfigs={state.localEmojiConfigs}
          isDraggable
          handleDragEnd={handleDragEnd}
        />
      )}
      <BackMenuButton onBackButtonClick={saveAndGoBack} />
      {state !== null ? (
        <div className="submenu-slider-container">
          <span className="submenu-label">
            <GiResize color={theme.colors.pink} size="2rem" />
          </span>
          <Slider
            min={EMOJI_CONFIG.MIN_SIZE}
            max={EMOJI_CONFIG.MAX_SIZE / 2}
            step={10}
            value={state.localSize}
            onChange={(value) => resizeLocalEmoji(value)}
            onRelease={(value) => resizeLocalEmoji(value)}
          />
          <DPad
            horizontalActions={(multiplier) => ({
              onLeftClick: () => {
                let newValue = state.localSize - multiplier;
                if (newValue <= 0) {
                  newValue = 0;
                }
                resizeLocalEmoji(newValue);
              },
              onRightClick: () =>
                resizeLocalEmoji(state.localSize + multiplier),
            })}
          />
        </div>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default SizeMenu;
