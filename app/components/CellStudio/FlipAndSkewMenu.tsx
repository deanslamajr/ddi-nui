import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import {
  CgEditFlipH,
  CgEditFlipV,
  CgArrowsExchangeAlt,
  CgArrowsExchangeV,
} from "react-icons/cg";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { flipEmoji, skewEmoji } from "~/contexts/ComicStudioState/actions";
import { getEmojiSkew } from "~/contexts/ComicStudioState/selectors";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import Slider, { links as sliderStylesUrl } from "~/components/Slider";
import DPad, { links as dPadStylesUrl } from "~/components/DPad";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

const SKEW_CHANGE_INCREMENT = 0.05;

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...sliderStylesUrl(),
    ...dPadStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const FlipAndSkewMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const emojiSkew = getEmojiSkew(comicStudioState, cellUrlId);

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      <div className="button-row with-margin">
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={() => dispatch(flipEmoji({ cellUrlId, type: "HORIZONTAL" }))}
        >
          <CgEditFlipH />
        </MenuButton>
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={() => dispatch(flipEmoji({ cellUrlId, type: "VERTICAL" }))}
        >
          <CgEditFlipV />
        </MenuButton>
      </div>
      {emojiSkew !== null ? (
        <>
          <div className="submenu-slider-container">
            <span className="submenu-label">
              <CgArrowsExchangeAlt color={theme.colors.pink} size="3rem" />
            </span>
            <Slider
              min={EMOJI_CONFIG.MIN_SKEW}
              max={EMOJI_CONFIG.MAX_SKEW}
              step={SKEW_CHANGE_INCREMENT}
              value={emojiSkew.skewX}
              onChange={(value) =>
                dispatch(
                  skewEmoji({
                    newSkewValue: value,
                    cellUrlId,
                    type: "HORIZONTAL",
                    shouldSaveChange: false,
                  })
                )
              }
              onRelease={(value) =>
                dispatch(
                  skewEmoji({
                    newSkewValue: value,
                    cellUrlId,
                    type: "HORIZONTAL",
                    shouldSaveChange: true,
                  })
                )
              }
            />
            <DPad
              horizontalActions={(multiplier) => ({
                onLeftClick: () =>
                  dispatch(
                    skewEmoji({
                      newSkewValue:
                        emojiSkew.skewX - multiplier * SKEW_CHANGE_INCREMENT,
                      cellUrlId,
                      type: "HORIZONTAL",
                      shouldSaveChange: true,
                    })
                  ),
                onRightClick: () =>
                  dispatch(
                    skewEmoji({
                      newSkewValue:
                        emojiSkew.skewX + multiplier * SKEW_CHANGE_INCREMENT,
                      cellUrlId,
                      type: "HORIZONTAL",
                      shouldSaveChange: true,
                    })
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
              value={emojiSkew.skewY}
              onChange={(value) =>
                dispatch(
                  skewEmoji({
                    newSkewValue: value,
                    cellUrlId,
                    type: "VERTICAL",
                    shouldSaveChange: false,
                  })
                )
              }
              onRelease={(value) =>
                dispatch(
                  skewEmoji({
                    newSkewValue: value,
                    cellUrlId,
                    type: "VERTICAL",
                    shouldSaveChange: true,
                  })
                )
              }
            />
            <DPad
              horizontalActions={(multiplier) => ({
                onLeftClick: () =>
                  dispatch(
                    skewEmoji({
                      newSkewValue:
                        emojiSkew.skewY - multiplier * SKEW_CHANGE_INCREMENT,
                      cellUrlId,
                      type: "VERTICAL",
                      shouldSaveChange: true,
                    })
                  ),
                onRightClick: () =>
                  dispatch(
                    skewEmoji({
                      newSkewValue:
                        emojiSkew.skewY + multiplier * SKEW_CHANGE_INCREMENT,
                      cellUrlId,
                      type: "VERTICAL",
                      shouldSaveChange: true,
                    })
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
