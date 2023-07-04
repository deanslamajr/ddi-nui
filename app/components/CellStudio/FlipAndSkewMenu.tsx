import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import {
  CgEditFlipH,
  CgEditFlipV,
  CgArrowsExchangeAlt,
  CgArrowsExchangeV,
} from "react-icons/cg";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  flipAndSkewEmoji,
  moveEmoji,
} from "~/contexts/ComicStudioState/actions";
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

const SKEW_CHANGE_INCREMENT = 0.05;

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...sliderStylesUrl(),
    ...dPadStylesUrl(),
    ...emojiCanvasStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const FlipAndSkewMenu: React.FC<{
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
      localSkew: { x: activeEmoji.skewX, y: activeEmoji.skewY },
      localScale: { x: activeEmoji.scaleX, y: activeEmoji.scaleY },
      localEmojiConfigs: clonedEmojiConfigs,
    };
  };

  const [state, setState] = React.useState<{
    localSkew: { x: number; y: number };
    localScale: { x: number; y: number };
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    return renderState();
  });

  React.useEffect(() => {
    setState(renderState());
  }, [emojiPosition?.x, emojiPosition?.y]);

  const skewLocalEmoji = (
    newSkew: number,
    type: "HORIZONTAL" | "VERTICAL"
  ): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newEmojiConfigs = { ...prevState!.localEmojiConfigs };

      if (type === "HORIZONTAL") {
        newEmojiConfigs[activeEmojiId!] = {
          ...prevActiveEmoji,
          skewX: newSkew,
        };
      } else {
        newEmojiConfigs[activeEmojiId!] = {
          ...prevActiveEmoji,
          skewY: newSkew,
        };
      }

      return {
        ...prevState!,
        localEmojiConfigs: newEmojiConfigs,
        localSkew: {
          x: newEmojiConfigs[activeEmojiId!].skewX,
          y: newEmojiConfigs[activeEmojiId!].skewY,
        },
      };
    });
  };

  const flipLocalEmoji = (type: "HORIZONTAL" | "VERTICAL"): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newEmojiConfigs = { ...prevState!.localEmojiConfigs };

      if (type === "HORIZONTAL") {
        newEmojiConfigs[activeEmojiId!] = {
          ...prevActiveEmoji,
          scaleX: prevActiveEmoji.scaleX * -1,
        };
      } else {
        newEmojiConfigs[activeEmojiId!] = {
          ...prevActiveEmoji,
          scaleY: prevActiveEmoji.scaleY * -1,
        };
      }

      return {
        ...prevState!,
        localEmojiConfigs: newEmojiConfigs,
        localScale: {
          x: newEmojiConfigs[activeEmojiId!].scaleX,
          y: newEmojiConfigs[activeEmojiId!].scaleY,
        },
      };
    });
  };

  const saveAndGoBack = () => {
    dispatch(
      flipAndSkewEmoji({
        newSkew: state!.localSkew,
        newScale: state!.localScale,
        cellUrlId,
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
      flipAndSkewEmoji({
        newSkew: state!.localSkew,
        newScale: state!.localScale,
        cellUrlId,
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
      {state !== null && state.localSkew !== null ? (
        <>
          <div className="button-row with-margin">
            <MenuButton
              noSpinner
              className="cell-studio-menu-button half-width"
              onClick={() => flipLocalEmoji("HORIZONTAL")}
            >
              <CgEditFlipH />
            </MenuButton>
            <MenuButton
              noSpinner
              className="cell-studio-menu-button half-width"
              onClick={() => flipLocalEmoji("VERTICAL")}
            >
              <CgEditFlipV />
            </MenuButton>
          </div>
          <div className="submenu-slider-container">
            <span className="submenu-label">
              <CgArrowsExchangeAlt color={theme.colors.pink} size="3rem" />
            </span>
            <Slider
              min={EMOJI_CONFIG.MIN_SKEW}
              max={EMOJI_CONFIG.MAX_SKEW}
              step={SKEW_CHANGE_INCREMENT}
              value={state!.localSkew.x}
              onChange={(value) => skewLocalEmoji(value, "HORIZONTAL")}
              onRelease={(value) => skewLocalEmoji(value, "HORIZONTAL")}
            />
            <DPad
              horizontalActions={(multiplier) => ({
                onLeftClick: () =>
                  skewLocalEmoji(
                    state!.localSkew.x - multiplier * SKEW_CHANGE_INCREMENT,
                    "HORIZONTAL"
                  ),
                onRightClick: () =>
                  skewLocalEmoji(
                    state!.localSkew.x + multiplier * SKEW_CHANGE_INCREMENT,
                    "HORIZONTAL"
                  ),
              })}
            />
          </div>
          <div className="submenu-slider-container">
            <span className="submenu-label">
              <CgArrowsExchangeV color={theme.colors.pink} size="3rem" />
            </span>
            <Slider
              min={EMOJI_CONFIG.MIN_SKEW}
              max={EMOJI_CONFIG.MAX_SKEW}
              step={SKEW_CHANGE_INCREMENT}
              value={state!.localSkew.y}
              onChange={(value) => skewLocalEmoji(value, "VERTICAL")}
              onRelease={(value) => skewLocalEmoji(value, "VERTICAL")}
            />
            <DPad
              horizontalActions={(multiplier) => ({
                onLeftClick: () =>
                  skewLocalEmoji(
                    state!.localSkew.y - multiplier * SKEW_CHANGE_INCREMENT,
                    "VERTICAL"
                  ),
                onRightClick: () =>
                  skewLocalEmoji(
                    state!.localSkew.y + multiplier * SKEW_CHANGE_INCREMENT,
                    "VERTICAL"
                  ),
              })}
            />
          </div>
        </>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default FlipAndSkewMenu;
