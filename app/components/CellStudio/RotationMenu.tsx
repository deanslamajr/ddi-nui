import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { TbRotate360 } from "react-icons/tb";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { DEFAULT_EMOJI_CONFIG } from "~/models/emojiConfig";
import { theme } from "~/utils/stylesTheme";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji, rotateEmoji } from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
  getEmojiRotation,
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
  const emojiRotation = getEmojiRotation(comicStudioState, cellUrlId);
  const emojiPosition = getEmojiPosition(comicStudioState, cellUrlId);

  const renderState = () => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    return {
      localRotation: emojiRotation || DEFAULT_EMOJI_CONFIG.rotation,
      localEmojiConfigs: clonedEmojiConfigs,
    };
  };

  const [state, setState] = React.useState<{
    localRotation: number;
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    return renderState();
  });

  React.useEffect(() => {
    setState(renderState());
  }, [emojiPosition?.x, emojiPosition?.y]);

  const rotateLocalEmoji = (newRotation: number): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newEmojiConfigs = { ...prevState!.localEmojiConfigs };
      newEmojiConfigs[activeEmojiId!] = {
        ...prevActiveEmoji,
        rotation: newRotation,
      };

      return {
        localRotation: newRotation,
        localEmojiConfigs: newEmojiConfigs,
      };
    });
  };

  const saveAndGoBack = () => {
    if (state!.localRotation !== emojiRotation) {
      dispatch(
        rotateEmoji({
          newRotation: state!.localRotation,
          cellUrlId,
          shouldSaveChange: true,
        })
      );
    }
    onBackButtonClick();
  };

  const handleDragEnd = ({
    xDiff,
    yDiff,
  }: {
    xDiff: number;
    yDiff: number;
  }): void => {
    if (state!.localRotation !== emojiRotation) {
      dispatch(
        rotateEmoji({
          newRotation: state!.localRotation,
          cellUrlId,
          shouldSaveChange: true,
        })
      );
    }
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
