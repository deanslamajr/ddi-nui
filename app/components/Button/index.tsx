import React from "react";
import { LinksFunction } from "remix";
import classNames from "classnames";

import stylesUrl from "~/styles/components/Button.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const MenuButton: React.FC<{
  accented?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, accented, onClick }) => {
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
      {isLoading ? <span className="loading">🤙</span> : children}
    </span>
  );
};
