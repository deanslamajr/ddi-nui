import { LinksFunction } from "remix";
import { MouseEventHandler, FC } from "react";

import stylesUrl from "./unstyled-link.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  href: string;
  onclick?: MouseEventHandler<HTMLAnchorElement>;
};

const UnstyledLink: FC<Props> = ({ children, href, onclick }) => {
  return (
    <a className="unstyled-link" href={href} onClick={onclick}>
      {children}
    </a>
  );
};

export default UnstyledLink;
