import React from "react";
import classNames from "classnames";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import {
  RxArrowUp,
  RxArrowLeft,
  RxArrowRight,
  RxArrowDown,
} from "react-icons/rx";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji } from "~/contexts/ComicStudioState/actions";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

const PositionMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [multiplier, setMultiplier] = React.useState<1 | 2 | 5>(1);

  const [_comicStudioState, dispatch] = useComicStudioState();

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />

      <div className="d-pad">
        <MenuButton
          className="cell-studio-menu-button half-width"
          noSpinner
          onClick={() =>
            dispatch(moveEmoji({ cellUrlId, xDiff: 0, yDiff: -1 * multiplier }))
          }
        >
          <RxArrowUp />
        </MenuButton>
        <div className="button-row">
          <MenuButton
            className="cell-studio-menu-button half-width"
            noSpinner
            onClick={() =>
              dispatch(
                moveEmoji({ cellUrlId, xDiff: -1 * multiplier, yDiff: 0 })
              )
            }
          >
            <RxArrowLeft />
          </MenuButton>
          <MenuButton
            className="cell-studio-menu-button half-width"
            noSpinner
            onClick={() =>
              dispatch(
                moveEmoji({ cellUrlId, xDiff: 1 * multiplier, yDiff: 0 })
              )
            }
          >
            <RxArrowRight />
          </MenuButton>
        </div>
        <MenuButton
          className="cell-studio-menu-button half-width"
          noSpinner
          onClick={() =>
            dispatch(moveEmoji({ cellUrlId, xDiff: 0, yDiff: 1 * multiplier }))
          }
        >
          <RxArrowDown />
        </MenuButton>
      </div>

      <MenuButton
        className={classNames("cell-studio-menu-button", {
          disabled: multiplier === 1,
        })}
        noSpinner
        onClick={() => setMultiplier(1)}
      >
        1x
      </MenuButton>
      <MenuButton
        className={classNames("cell-studio-menu-button", {
          disabled: multiplier === 2,
        })}
        noSpinner
        onClick={() => setMultiplier(2)}
      >
        2x
      </MenuButton>
      <MenuButton
        className={classNames("cell-studio-menu-button", {
          disabled: multiplier === 5,
        })}
        noSpinner
        onClick={() => setMultiplier(5)}
      >
        5x
      </MenuButton>
    </>
  );
};

export default PositionMenu;
