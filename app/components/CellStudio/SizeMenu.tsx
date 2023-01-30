import React from "react";
import type { LinksFunction } from "@remix-run/node";
import styled from "styled-components";
import { useParams } from "@remix-run/react";
import { GiResize } from "react-icons/gi";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { resizeEmoji } from "~/contexts/ComicStudioState/actions";
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

const SliderContainer = styled.div`
  width: 100%;
  padding: 0.5rem 0 1.5rem;
`;

const Label = styled.span`
  margin: 0.1rem auto;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const SizeMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [state, setState] = React.useState<{
    localSize: number;
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    const activeEmoji = clonedEmojiConfigs[activeEmojiId];
    return {
      localSize: activeEmoji.size,
      localEmojiConfigs: clonedEmojiConfigs,
    };
  });

  const resizeLocalEmoji = (newSize: number): void => {
    setState((prevState) => {
      const activeEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!activeEmoji) {
        return prevState;
      }
      activeEmoji.size = newSize;

      return {
        localSize: newSize,
        localEmojiConfigs: state!.localEmojiConfigs,
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
        <SliderContainer>
          <Label>
            <GiResize color={theme.colors.pink} size="2rem" />
          </Label>
          <Slider
            min={EMOJI_CONFIG.MIN_SIZE}
            max={EMOJI_CONFIG.MAX_SIZE}
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
        </SliderContainer>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default SizeMenu;
