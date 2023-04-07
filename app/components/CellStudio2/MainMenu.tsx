import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { IoMdPersonAdd, IoIosColorFilter } from "react-icons/io";
import { TiArrowBackOutline } from "react-icons/ti";
import { SlCursorMove } from "react-icons/sl";
import { GiResize } from "react-icons/gi";
import { TbRotate360 } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";
import EmojiMenu, { links as emojiMenuStylesUrl } from "./EmojiMenu";

import stylesUrl from "~/styles/components/CellStudio.css";
import classNames from "classnames";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiMenuStylesUrl(),
    ...emojiIconStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export const BackMenuButton: React.FC<{ onBackButtonClick: () => void }> = ({
  onBackButtonClick,
}) => {
  return (
    <MenuButton
      accented
      className="cell-studio-menu-button"
      noSpinner
      onClick={onBackButtonClick}
    >
      <TiArrowBackOutline />
    </MenuButton>
  );
};

const MainMenu: React.FC<{
  currentLowerSectionMode: "EMOJI" | "FILTERS";
  setCurrentLowerSectionMode: React.Dispatch<
    React.SetStateAction<"EMOJI" | "FILTERS">
  >;
  onAddButtonClick: () => void;
  onPositionButtonClick: () => void;
  onSizeButtonClick: () => void;
  onRotateButtonClick: () => void;
  onFlipAndSkewButtonClick: () => void;
  filtersMenu: React.ReactNode;
}> = ({
  currentLowerSectionMode,
  setCurrentLowerSectionMode,
  onAddButtonClick,
  onPositionButtonClick,
  onSizeButtonClick,
  onRotateButtonClick,
  onFlipAndSkewButtonClick,
  filtersMenu,
}) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  return (
    <>
      <div className="button-row">
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={onSizeButtonClick}
        >
          <GiResize />
        </MenuButton>
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={onPositionButtonClick}
        >
          <SlCursorMove />
        </MenuButton>
      </div>
      <div className="button-row">
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={onRotateButtonClick}
        >
          <TbRotate360 />
        </MenuButton>
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={onFlipAndSkewButtonClick}
        >
          <GrTransaction />
        </MenuButton>
      </div>
      <div className="button-row lower-section">
        <MenuButton
          isSecondary={currentLowerSectionMode === "EMOJI"}
          className={classNames("cell-studio-menu-button", "half-width", {
            ["unselected-submenu-button"]: currentLowerSectionMode !== "EMOJI",
          })}
          onClick={() => setCurrentLowerSectionMode("EMOJI")}
          noSpinner
        >
          {activeEmojiId && cellStudioState && (
            <EmojiIcon config={cellStudioState.emojis[activeEmojiId]} />
          )}
        </MenuButton>
        <MenuButton
          isSecondary={currentLowerSectionMode === "FILTERS"}
          className={classNames("cell-studio-menu-button", "half-width", {
            ["unselected-submenu-button"]:
              currentLowerSectionMode !== "FILTERS",
          })}
          onClick={() => setCurrentLowerSectionMode("FILTERS")}
          noSpinner
        >
          <IoIosColorFilter />
        </MenuButton>
      </div>

      {currentLowerSectionMode === "EMOJI" ? (
        <>
          <MenuButton
            accented
            className="cell-studio-menu-button"
            onClick={onAddButtonClick}
          >
            <IoMdPersonAdd />
          </MenuButton>
          <EmojiMenu />
        </>
      ) : currentLowerSectionMode === "FILTERS" ? (
        filtersMenu
      ) : null}
    </>
  );
};

export default MainMenu;