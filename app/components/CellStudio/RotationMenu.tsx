import React from "react";
import type { LinksFunction } from "@remix-run/node";
import styled from "styled-components";
import { useParams } from "@remix-run/react";

import { EMOJI_CONFIG } from "~/utils/constants";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { rotateEmoji } from "~/contexts/ComicStudioState/actions";
import { getEmojiRotation } from "~/contexts/ComicStudioState/selectors";

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

const RotationMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const emojiRotation = getEmojiRotation(comicStudioState, cellUrlId);

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      {emojiRotation !== null ? (
        <SliderContainer>
          <Label>ROTATION</Label>
          <Slider
            min={EMOJI_CONFIG.MIN_ROTATION}
            max={EMOJI_CONFIG.MAX_ROTATION}
            step={1}
            value={emojiRotation}
            onChange={(value) =>
              dispatch(
                rotateEmoji({
                  newRotation: value,
                  cellUrlId,
                  shouldSaveChange: false,
                })
              )
            }
            onRelease={(value) =>
              dispatch(
                rotateEmoji({
                  newRotation: value,
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
                  rotateEmoji({
                    newRotation: emojiRotation - multiplier,
                    cellUrlId,
                    shouldSaveChange: true,
                  })
                ),
              onRightClick: () =>
                dispatch(
                  rotateEmoji({
                    newRotation: emojiRotation + multiplier,
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

export default RotationMenu;
