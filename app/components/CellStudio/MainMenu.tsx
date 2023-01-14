import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { IoMdPersonAdd } from "react-icons/io";
import { TiArrowBackOutline } from "react-icons/ti";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
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
  onEmojiButtonClick: () => void;
  onCellButtonClick: () => void;
  onPositionButtonClick: () => void;
  onSizeButtonClick: () => void;
}> = ({
  onAddButtonClick,
  onEmojiButtonClick,
  onCellButtonClick,
  onPositionButtonClick,
  onSizeButtonClick,
}) => {
  return (
    <>
      <MenuButton
        accented
        className="cell-studio-menu-button"
        onClick={onAddButtonClick}
      >
        <IoMdPersonAdd />
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={onCellButtonClick}
      >
        CELL
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={onEmojiButtonClick}
      >
        EMOJI
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={onSizeButtonClick}
      >
        SIZE
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={onPositionButtonClick}
      >
        POSITION
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={() => console.log("clicked!")}
      >
        ROTATION
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={() => console.log("clicked!")}
      >
        SKEW
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={() => console.log("clicked!")}
      >
        FILTERS
      </MenuButton>
    </>
  );
};

export default MainMenu;
