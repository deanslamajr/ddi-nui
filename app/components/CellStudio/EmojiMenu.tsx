import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { DndContext, useDroppable } from "@dnd-kit/core";

import sortEmojis from "~/utils/sortEmoijs";
import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiIconStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const Droppable: React.FC<{ dropId: string }> = ({ dropId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
  });

  return <span ref={setNodeRef} className="button"></span>;
};

const EmojiMenu: React.FC<{
  activeEmojiId: number;
  emojiConfigs: Record<string, EmojiConfigSerialized>;
  onBackButtonClick: () => void;
}> = ({ activeEmojiId, emojiConfigs, onBackButtonClick }) => {
  const [state, setState] = React.useState<{
    localEmojiConfigs: EmojiConfigSerialized[];
  }>(() => {
    const localEmojiConfigs = emojiConfigs ? Object.values(emojiConfigs) : [];
    const sortedEmojiConfigs = sortEmojis(localEmojiConfigs, true);
    return {
      localEmojiConfigs: sortedEmojiConfigs,
    };
  });

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        CHANGE EMOJI
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        DUPLICATE EMOJI
      </MenuButton>

      <DndContext>
        {state.localEmojiConfigs.map((emoji) => (
          <>
            <Droppable dropId={emoji.id.toString()} />
            <MenuButton
              key={`${emoji.emoji}-${emoji.id}`}
              dragId={emoji.id.toString()}
              isSecondary={emoji.id === activeEmojiId}
              className="cell-studio-menu-button"
              // onClick={onEmojiButtonClick}
            >
              <EmojiIcon config={emoji} />
            </MenuButton>
          </>
        ))}
        <Droppable dropId={"bottom"} />
      </DndContext>
    </>
  );
};

export default EmojiMenu;
