import React from "react";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";
import { useDraggable } from "@dnd-kit/core";

import stylesUrl from "~/styles/components/Button.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const MenuButton: React.FC<
  React.PropsWithChildren<{
    accented?: boolean;
    dragId?: string;
    className?: string;
    isSecondary?: boolean;
    onClick?: () => void;
    noSpinner?: boolean;
  }>
> = ({
  children,
  className,
  accented,
  isSecondary,
  onClick,
  noSpinner,
  dragId,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dragId || "draggable",
    disabled: !Boolean(dragId),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        onClick && setTimeout(onClick);
      }}
      className={classNames("button", {
        accented,
        secondary: isSecondary,
        [`${className}`]: className,
      })}
    >
      {isLoading && !noSpinner ? <span className="loading">🤙</span> : children}
    </span>
  );
};
