import { LinksFunction } from "remix";
import React from "react";

import stylesUrl from "~/styles/components/Logo.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  text: string;
};

const Header: React.FC<Props> = ({ text }) => {
  return <span className="logo noselect">{text}</span>;
};

export default Header;
