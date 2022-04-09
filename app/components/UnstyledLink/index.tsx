import { LinksFunction } from "remix";
import { FC } from "react";

import stylesUrl from "./unstyled-link.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  href: string;
};

const UnstyledLink: FC<Props> = ({ children, href }) => {
  return (
    <a className="unstyled-link" href={href}>
      {children}
    </a>
  );
};

export default UnstyledLink;
