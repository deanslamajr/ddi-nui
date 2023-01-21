import React from "react";
import type { LinksFunction } from "@remix-run/node";

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
      {state.localEmojiConfigs.map((emoji) => (
        <MenuButton
          key={`${emoji.emoji}-${emoji.id}`}
          isSecondary={emoji.id === activeEmojiId}
          className="cell-studio-menu-button"
          // onClick={onEmojiButtonClick}
        >
          <EmojiIcon config={emoji} />
        </MenuButton>
      ))}
    </>
  );
};

export default EmojiMenu;
