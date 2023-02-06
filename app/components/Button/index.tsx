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
    isSecondary?: boolean;
    onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    noSpinner?: boolean;
  }>
> = ({ children, className, accented, isSecondary, onClick, noSpinner }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <span
      onClick={(event) => {
        if (onClick) {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 1000);
          setTimeout(() => onClick(event));
        }
      }}
      className={classNames("button", {
        accented,
        secondary: isSecondary,
        [`${className}`]: className,
        clickable: onClick,
      })}
    >
      {isLoading && !noSpinner ? <span className="loading">🤙</span> : children}
    </span>
  );
};
