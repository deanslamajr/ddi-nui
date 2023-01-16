import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { IoMdPersonAdd, IoIosColorFilter } from "react-icons/io";
import { TiArrowBackOutline } from "react-icons/ti";
import { SlCursorMove } from "react-icons/sl";
import { GiResize } from "react-icons/gi";
import { TbRotate360 } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import CellPreview from "~/components/ComicStudio/CellPreview";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
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
  activeEmojiConfig: EmojiConfigSerialized;
  cellUrlId: string;
  onAddButtonClick: () => void;
  onEmojiButtonClick: () => void;
  onCellButtonClick: () => void;
  onPositionButtonClick: () => void;
  onSizeButtonClick: () => void;
  onRotateButtonClick: () => void;
}> = ({
  activeEmojiConfig,
  cellUrlId,
  onAddButtonClick,
  onEmojiButtonClick,
  onCellButtonClick,
  onPositionButtonClick,
  onSizeButtonClick,
  onRotateButtonClick,
}) => {
  return (
    <>
      <div className="button-row">
        <MenuButton
          isSecondary
          className="cell-studio-menu-button half-width"
          onClick={onCellButtonClick}
        >
          <CellPreview
            cellUrlId={cellUrlId}
            cellWidth="40px"
            isButtonIcon
            onCellClick={() => {}}
          />
        </MenuButton>
        <MenuButton
          isSecondary
          className="cell-studio-menu-button half-width"
          onClick={onEmojiButtonClick}
        >
          <EmojiIcon config={activeEmojiConfig} />
        </MenuButton>
      </div>
      <MenuButton
        accented
        className="cell-studio-menu-button"
        onClick={onAddButtonClick}
      >
        <IoMdPersonAdd />
      </MenuButton>
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
          onClick={() => console.log("clicked!")}
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
    </>
  );
};

export default MainMenu;
