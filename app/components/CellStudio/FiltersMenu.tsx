import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { RxOpacity } from "react-icons/rx";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoIosColorFilter } from "react-icons/io";
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

const FiltersMenu: React.FC<{
  onRGBAButtonClick: () => void;
  onOpacityButtonClick: () => void;
}> = ({ onRGBAButtonClick, onOpacityButtonClick }) => {
  // const params = useParams();
  // const cellUrlId = params.cellUrlId!;

  // const [comicStudioState, dispatch] = useComicStudioState();
  // const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  // const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  return (
    <>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={onOpacityButtonClick}
      >
        <RxOpacity />
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button"
        onClick={onRGBAButtonClick}
      >
        <IoIosColorFilter />
      </MenuButton>
    </>
  );
};

export default FiltersMenu;
