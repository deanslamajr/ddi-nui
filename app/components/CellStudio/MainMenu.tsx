import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { IoMdPersonAdd, IoIosColorFilter } from "react-icons/io";
import { TiArrowBackOutline } from "react-icons/ti";
import { SlCursorMove } from "react-icons/sl";
import { GiPaintBucket, GiResize } from "react-icons/gi";
import { TbRotate360 } from "react-icons/tb";
import { MdCompareArrows } from "react-icons/md";
import { BsTrash3Fill } from "react-icons/bs";
import { RiUserSettingsFill } from "react-icons/ri";
import { ImCopy } from "react-icons/im";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { copyEmoji, deleteEmoji } from "~/contexts/ComicStudioState/actions";
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
  onCanvasColorButtonClick: () => void;
  filtersMenu: React.ReactNode;
}> = ({
  currentLowerSectionMode,
  setCurrentLowerSectionMode,
  onAddButtonClick,
  onPositionButtonClick,
  onSizeButtonClick,
  onRotateButtonClick,
  onFlipAndSkewButtonClick,
  onCanvasColorButtonClick,
  filtersMenu,
}) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [isEmojiCRUDVisible, setIsEmojiCRUDVisible] = React.useState(false);

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  return (
    <>
      <div className="button-row lower-section">
        {/* <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={() => console.log("TODO implement")}
        >
          <MdOutlineAddComment size="2rem" />
        </MenuButton> */}
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={onCanvasColorButtonClick}
        >
          <GiPaintBucket />
        </MenuButton>
      </div>
      <div className="button-row lower-section">
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
          <MdCompareArrows />
        </MenuButton>
      </div>
      <div className="button-row lower-section">
        <MenuButton
          isSecondary={currentLowerSectionMode === "EMOJI"}
          className={classNames("cell-studio-menu-button", "half-width", {
            ["unselected-submenu-button"]: currentLowerSectionMode !== "EMOJI",
          })}
          onClick={() => {
            if (isEmojiCRUDVisible) {
              setIsEmojiCRUDVisible(false);
            } else if (currentLowerSectionMode === "EMOJI") {
              setIsEmojiCRUDVisible(true);
              activeEmojiId &&
                document
                  .getElementById(activeEmojiId?.toString())
                  ?.scrollIntoView(false);
            } else {
              setCurrentLowerSectionMode("EMOJI");
            }
          }}
          noSpinner
        >
          {activeEmojiId && cellStudioState && (
            <EmojiIcon config={cellStudioState.emojis[activeEmojiId]} />
          )}
        </MenuButton>

        <MenuButton
          isSecondary={currentLowerSectionMode === "FILTERS"}
          className={classNames("cell-studio-menu-button", "half-width", {
            ["unselected-submenu-button without-pulse"]:
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
          {isEmojiCRUDVisible && (
            <>
              <MenuButton
                className="cell-action-button secondary"
                onClick={() => {
                  dispatch(deleteEmoji({ cellUrlId }));
                  setIsEmojiCRUDVisible(false);
                }}
                noSpinner
              >
                <BsTrash3Fill size="1.5rem" />
              </MenuButton>
              <MenuButton
                className="cell-action-button secondary"
                onClick={() => {
                  console.log("copy emoji!");
                  dispatch(copyEmoji({ cellUrlId }));
                  setIsEmojiCRUDVisible(false);
                }}
                noSpinner
              >
                <ImCopy size="1.5rem" />
              </MenuButton>
              <MenuButton
                className="cell-action-button secondary"
                onClick={() => {
                  console.log("change emoji!");
                  // dispatch(deleteEmoji({ cellUrlId }));
                  setIsEmojiCRUDVisible(false);
                }}
                noSpinner
              >
                <RiUserSettingsFill size="1.5rem" />
              </MenuButton>
            </>
          )}
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
      <div className="bottom-spacer" />
    </>
  );
};

export default MainMenu;
