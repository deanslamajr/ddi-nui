import React from "react";
import Konva from "konva";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { MdOutlineOpacity } from "react-icons/md";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoIosColorFilter } from "react-icons/io";
// import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { MdToggleOff, MdToggleOn } from "react-icons/md";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";
import { toggleActiveFilter } from "~/contexts/ComicStudioState/actions";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/CellStudio.css";
import classNames from "classnames";

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

const FiltersMenu: React.FC<{
  onRGBAButtonClick: () => void;
  onOpacityButtonClick: () => void;
}> = ({ onRGBAButtonClick, onOpacityButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const toggleRGBAFilter = () => {
    dispatch(
      toggleActiveFilter({
        cellUrlId,
        filterType: "RGBA",
      })
    );
  };

  const isRGBAFilterEnabled =
    activeEmojiId &&
    cellStudioState?.emojis[activeEmojiId].filters?.includes("RGBA");

  return (
    <>
      <div className="button-row">
        <MenuButton className="cell-studio-menu-button half-width spacer" />
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={onOpacityButtonClick}
        >
          <MdOutlineOpacity />
        </MenuButton>
      </div>
      <div className="button-row">
        <MenuButton
          className={classNames(
            "cell-studio-menu-button",
            "half-width",
            "filter-toggle",
            { enabled: isRGBAFilterEnabled }
          )}
          onClick={toggleRGBAFilter}
          noSpinner
        >
          {isRGBAFilterEnabled ? (
            <MdToggleOn size="5rem" />
          ) : (
            <MdToggleOff size="5rem" />
          )}
        </MenuButton>
        <MenuButton
          className={classNames("cell-studio-menu-button", "half-width", {
            disabled: !isRGBAFilterEnabled,
          })}
          onClick={isRGBAFilterEnabled ? onRGBAButtonClick : undefined}
        >
          <IoIosColorFilter />
        </MenuButton>
      </div>
    </>
  );
};

export default FiltersMenu;
