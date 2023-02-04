import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { IoMdPersonAdd, IoIosColorFilter } from "react-icons/io";
import { TiArrowBackOutline } from "react-icons/ti";
import { SlCursorMove } from "react-icons/sl";
import { GiResize } from "react-icons/gi";
import { TbRotate360 } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiMenu, { links as emojiMenuStylesUrl } from "./EmojiMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiMenuStylesUrl(),
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
  onAddButtonClick: () => void;
  onPositionButtonClick: () => void;
  onSizeButtonClick: () => void;
  onRotateButtonClick: () => void;
  onFlipAndSkewButtonClick: () => void;
}> = ({
  onAddButtonClick,
  onPositionButtonClick,
  onSizeButtonClick,
  onRotateButtonClick,
  onFlipAndSkewButtonClick,
}) => {
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
      <MenuButton
        className="cell-studio-menu-button"
        onClick={() => console.log("clicked!")}
      >
        <IoIosColorFilter />
      </MenuButton>

      <MenuButton
        accented
        className="cell-studio-menu-button"
        onClick={onAddButtonClick}
      >
        <IoMdPersonAdd />
      </MenuButton>

      <EmojiMenu />
    </>
  );
};

export default MainMenu;
