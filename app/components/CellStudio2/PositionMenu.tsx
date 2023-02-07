import React from "react";
import cloneDeep from "fast-clone";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { moveEmoji } from "~/contexts/ComicStudioState/actions";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";

import DPad, { links as dPadStylesUrl } from "~/components/DPad";
import EmojiCanvas, {
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";
import { BackMenuButton } from "./MainMenu";

export const links: LinksFunction = () => {
  return [...dPadStylesUrl(), ...emojiCanvasStylesUrl()];
};

const PositionMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [state, setState] = React.useState<{
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
    localPosition: {
      x: number;
      y: number;
    };
  } | null>(() => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);
    const activeEmoji = clonedEmojiConfigs[activeEmojiId];

    return {
      localEmojiConfigs: clonedEmojiConfigs,
      localPosition: {
        x: activeEmoji.x,
        y: activeEmoji.y,
      },
    };
  });

  const moveLocalEmoji = ({
    xDiff,
    yDiff,
  }: {
    xDiff: number;
    yDiff: number;
  }): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newX = prevState!.localPosition.x + xDiff;
      const newY = prevState!.localPosition.y + yDiff;

      prevState!.localEmojiConfigs[activeEmojiId!] = {
        ...prevActiveEmoji,
        x: newX,
        y: newY,
      };

      return {
        localEmojiConfigs: prevState!.localEmojiConfigs,
        localPosition: { x: newX, y: newY },
      };
    });
  };

  const saveAndGoBack = () => {
    dispatch(
      moveEmoji({
        abs: state!.localPosition,
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
  }) => {
    moveLocalEmoji({
      xDiff,
      yDiff,
    });
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
      <DPad
        verticalActions={(multiplier) => ({
          onUpClick: () => moveLocalEmoji({ xDiff: 0, yDiff: -1 * multiplier }),
          onDownClick: () =>
            moveLocalEmoji({ xDiff: 0, yDiff: 1 * multiplier }),
        })}
        horizontalActions={(multiplier) => ({
          onLeftClick: () =>
            moveLocalEmoji({ xDiff: -1 * multiplier, yDiff: 0 }),
          onRightClick: () =>
            moveLocalEmoji({ xDiff: 1 * multiplier, yDiff: 0 }),
        })}
      />
    </>
  );
};

export default PositionMenu;
