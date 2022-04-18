import { LinksFunction } from "remix";

import stylesUrl from "./logo.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Logo() {
  return <span className="logo noselect">draw draw ink</span>;
}
