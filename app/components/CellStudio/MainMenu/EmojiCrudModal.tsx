import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import Modal, { links as modalStylesUrl } from "~/components/Modal";
import { MdOutlineFindReplace } from "react-icons/md";
import { BsTrash3Fill } from "react-icons/bs";
import { ImCopy } from "react-icons/im";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  addEmoji,
  copyEmoji,
  deleteEmoji,
} from "~/contexts/ComicStudioState/actions";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";

import { BackMenuButton } from "./index";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiIconStylesUrl(),
    ...modalStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const EmojiCrudModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal: closeModal }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  return (
    <>
      <BackMenuButton onBackButtonClick={() => closeModal()} />
      <MenuButton
        className="cell-studio-menu-button cell-action-button secondary"
        onClick={() => {
          dispatch(deleteEmoji({ cellUrlId }));
          closeModal();
        }}
        noSpinner
      >
        <BsTrash3Fill size="1.5rem" />
        {activeEmojiId && cellStudioState && (
          <EmojiIcon config={cellStudioState.emojis[activeEmojiId]} />
        )}
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button cell-action-button secondary"
        onClick={() => {
          dispatch(copyEmoji({ cellUrlId }));
          closeModal();
        }}
        noSpinner
      >
        <ImCopy size="1.5rem" />
        {activeEmojiId && cellStudioState && (
          <EmojiIcon config={cellStudioState.emojis[activeEmojiId]} />
        )}
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button cell-action-button secondary"
        onClick={() => {
          console.log("change emoji!");
          // dispatch(deleteEmoji({ cellUrlId }));
          closeModal();
        }}
        noSpinner
      >
        <MdOutlineFindReplace size="1.5rem" />
        {activeEmojiId && cellStudioState && (
          <EmojiIcon config={cellStudioState.emojis[activeEmojiId]} />
        )}
      </MenuButton>
    </>
  );
};

export default EmojiCrudModal;
