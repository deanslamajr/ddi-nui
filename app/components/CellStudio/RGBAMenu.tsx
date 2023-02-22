import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { IoIosColorFilter } from "react-icons/io";
import cloneDeep from "fast-clone";
import { RgbaColorPicker } from "react-colorful";

import { theme } from "~/utils/stylesTheme";
import {
  EmojiConfigSerialized,
  DEFAULT_EMOJI_CONFIG,
} from "~/models/emojiConfig";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  moveEmoji,
  updateRGBAFilter,
} from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
  getEmojiRGBA,
  getEmojiPosition,
} from "~/contexts/ComicStudioState/selectors";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiCanvas, {
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...emojiCanvasStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const RGBAMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);
  const emojiRGBA = getEmojiRGBA(comicStudioState, cellUrlId);
  const emojiPosition = getEmojiPosition(comicStudioState, cellUrlId);

  const renderState = () => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    return {
      localRGBA: emojiRGBA
        ? {
            a: emojiRGBA.alpha,
            r: emojiRGBA.red,
            g: emojiRGBA.green,
            b: emojiRGBA.blue,
          }
        : {
            a: DEFAULT_EMOJI_CONFIG.alpha,
            r: DEFAULT_EMOJI_CONFIG.red,
            g: DEFAULT_EMOJI_CONFIG.green,
            b: DEFAULT_EMOJI_CONFIG.blue,
          },
      localEmojiConfigs: clonedEmojiConfigs,
    };
  };

  const [state, setState] = React.useState<{
    localRGBA: { r: number; g: number; b: number; a: number };
    localEmojiConfigs: Record<string, EmojiConfigSerialized>;
  } | null>(() => {
    return renderState();
  });

  React.useEffect(() => {
    setState(renderState());
  }, [emojiPosition?.x, emojiPosition?.y]);

  const setLocalRGBA = (newColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  }): void => {
    setState((prevState) => {
      const prevActiveEmoji = prevState!.localEmojiConfigs[activeEmojiId!];
      if (!prevActiveEmoji) {
        return prevState;
      }

      const newEmojiConfigs = { ...prevState!.localEmojiConfigs };
      newEmojiConfigs[activeEmojiId!] = {
        ...prevActiveEmoji,
        alpha: newColor.a,
        red: newColor.r,
        green: newColor.g,
        blue: newColor.b,
      };

      return {
        localRGBA: newColor,
        localEmojiConfigs: newEmojiConfigs,
      };
    });
  };

  const isLocalDirty = () => {
    return (
      emojiRGBA?.alpha !== state!.localRGBA.a ||
      emojiRGBA?.red !== state!.localRGBA.r ||
      emojiRGBA?.green !== state!.localRGBA.g ||
      emojiRGBA?.blue !== state!.localRGBA.b
    );
  };

  const saveAndGoBack = () => {
    if (state && isLocalDirty()) {
      dispatch(
        updateRGBAFilter({
          cellUrlId,
          newFilterValues: {
            red: state.localRGBA.r,
            green: state.localRGBA.g,
            blue: state.localRGBA.b,
            alpha: state.localRGBA.a,
          },
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
    if (state && isLocalDirty()) {
      dispatch(
        updateRGBAFilter({
          cellUrlId,
          newFilterValues: {
            red: state.localRGBA.r,
            green: state.localRGBA.g,
            blue: state.localRGBA.b,
            alpha: state.localRGBA.a,
          },
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
      {state !== null ? (
        <div className="submenu-slider-container">
          <span className="submenu-label">
            <IoIosColorFilter color={theme.colors.pink} size="2rem" />
          </span>
          <RgbaColorPicker color={state.localRGBA} onChange={setLocalRGBA} />
        </div>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default RGBAMenu;
