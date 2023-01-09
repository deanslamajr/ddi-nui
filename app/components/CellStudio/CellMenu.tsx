import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

const CellMenu: React.FC<{
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  return (
    <>
      <MenuButton
        accented
        className="cell-studio-menu-button"
        onClick={onBackButtonClick}
      >
        🔙
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        CAPTION
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        CANVAS COLOR
      </MenuButton>
    </>
  );
};

export default CellMenu;
