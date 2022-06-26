import { Form, LinksFunction } from "remix";
import { useTransition } from "@remix-run/react";
import classnames from "classnames";
import { useEffect, useState } from "react";

import stylesUrl from "./show-more-loader.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  isUpper?: boolean;
};

export default function ShowMoreLoader({ isUpper }: Props) {
  return (
    <div
      className={classnames("nav-button", "show-more", "loading", {
        ["bottom-center"]: !isUpper,
        ["top-center"]: isUpper,
      })}
    >
      🤙
    </div>
  );
}
