import React from "react";

import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji } from "~/contexts/ComicStudioState/actions";

import DPad, { links as dPadStylesUrl } from "~/components/DPad";
import { BackMenuButton } from "./MainMenu";

export const links: LinksFunction = () => {
  return [...dPadStylesUrl()];
};

const PositionMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [_comicStudioState, dispatch] = useComicStudioState();

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      <DPad
        verticalActions={(multiplier) => ({
          onUpClick: () =>
            dispatch(
              moveEmoji({ cellUrlId, xDiff: 0, yDiff: -1 * multiplier })
            ),
          onDownClick: () =>
            dispatch(moveEmoji({ cellUrlId, xDiff: 0, yDiff: 1 * multiplier })),
        })}
        horizontalActions={(multiplier) => ({
          onLeftClick: () =>
            dispatch(
              moveEmoji({ cellUrlId, xDiff: -1 * multiplier, yDiff: 0 })
            ),
          onRightClick: () =>
            dispatch(moveEmoji({ cellUrlId, xDiff: 1 * multiplier, yDiff: 0 })),
        })}
      />
    </>
  );
};

export default PositionMenu;
