import React from "react";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";

import stylesUrl from "~/styles/components/Button.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const MenuButton: React.FC<
  React.PropsWithChildren<{
    accented?: boolean;
    className?: string;
    onClick?: () => void;
    noSpinner?: boolean;
  }>
> = ({ children, className, accented, onClick, noSpinner }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <span
      onClick={() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        onClick && setTimeout(onClick);
      }}
      className={classNames("button", {
        accented,
        [`${className}`]: className,
      })}
    >
      {isLoading && !noSpinner ? <span className="loading">🤙</span> : children}
    </span>
  );
};
