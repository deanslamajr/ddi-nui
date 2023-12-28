import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { IoIosColorFilter } from "react-icons/io";
import cloneDeep from "fast-clone";
import { RgbaColorPicker } from "react-colorful";

import { theme } from "~/utils/stylesTheme";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  updateRGBAFilter,
  moveEmoji,
} from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
  getEmojiPosition,
  getCellSchemaVersion,
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
  const emojiPosition = getEmojiPosition(comicStudioState, cellUrlId);
  const schemaVersion = getCellSchemaVersion(comicStudioState, cellUrlId);

  const renderState = () => {
    if (!cellStudioState || !activeEmojiId) {
      return null;
    }

    const clonedEmojiConfigs = cloneDeep(cellStudioState.emojis);

    const activeEmoji = clonedEmojiConfigs[activeEmojiId];
    return {
      localRGBA: {
        a: activeEmoji.alpha,
        r: activeEmoji.red,
        g: activeEmoji.green,
        b: activeEmoji.blue,
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

  const saveAndGoBack = () => {
    if (state) {
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
    if (state) {
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
          schemaVersion={schemaVersion}
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
