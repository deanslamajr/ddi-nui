import React from "react";
import type { LinksFunction } from "@remix-run/node";
import styled from "styled-components";
import { useParams } from "@remix-run/react";

import { EMOJI_CONFIG } from "~/utils/constants";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { resizeEmoji } from "~/contexts/ComicStudioState/actions";
import { getEmojiSize } from "~/contexts/ComicStudioState/selectors";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import Slider, { links as sliderStylesUrl } from "~/components/Slider";
import DPad, { links as dPadStylesUrl } from "~/components/DPad";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
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
  const emojiSize = getEmojiSize(comicStudioState, cellUrlId);

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      {emojiSize !== null ? (
        <SliderContainer>
          <Label>SIZE</Label>
          <Slider
            min={EMOJI_CONFIG.MIN_SIZE}
            max={EMOJI_CONFIG.MAX_SIZE}
            step={1}
            value={emojiSize}
            onChange={(value) =>
              dispatch(
                resizeEmoji({
                  newSize: value,
                  cellUrlId,
                  shouldSaveChange: false,
                })
              )
            }
            onRelease={(value) =>
              dispatch(
                resizeEmoji({
                  newSize: value,
                  cellUrlId,
                  shouldSaveChange: true,
                })
              )
            }
          />
          <DPad
            horizontalActions={(multiplier) => ({
              onLeftClick: () =>
                dispatch(
                  resizeEmoji({
                    newSize: emojiSize - multiplier,
                    cellUrlId,
                    shouldSaveChange: true,
                  })
                ),
              onRightClick: () =>
                dispatch(
                  resizeEmoji({
                    newSize: emojiSize + multiplier,
                    cellUrlId,
                    shouldSaveChange: true,
                  })
                ),
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
