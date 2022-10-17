import type { LinksFunction } from "@remix-run/node";
import { MouseEventHandler, FC } from "react";
import { Link, LinkProps } from "@remix-run/react";

import stylesUrl from "~/styles/components/UnstyledLink.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props =
  | {
      id?: string;
      isRemixLink?: false;
      href: string;
      onclick?: MouseEventHandler<HTMLAnchorElement>;
    }
  | ({
      id?: string;
      isRemixLink: true;
      href: string;
      onclick?: MouseEventHandler<HTMLAnchorElement>;
    } & Omit<LinkProps, "to">);

const UnstyledLink: FC<Props> = ({
  children,
  href,
  id,
  isRemixLink,
  onclick,
  ...remixLinkProps
}) => {
  return isRemixLink ? (
    <Link
      {...remixLinkProps}
      id={id}
      className="unstyled-link"
      to={href}
      onClick={onclick}
    >
      {children}
    </Link>
  ) : (
    <a id={id} className="unstyled-link" href={href} onClick={onclick}>
      {children}
    </a>
  );
};

export default UnstyledLink;
