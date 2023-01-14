import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

const EmojiMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        CHANGE LAYER
      </MenuButton>
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
    </>
  );
};

export default EmojiMenu;
