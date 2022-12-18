import React from "react";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";

import useSafeScroll from "~/hooks/useSafeScroll";

import stylesUrl from "~/styles/components/Modal.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const CenteredContainer: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={classNames("centered-container", className)}>{children}</div>
);

export const MessageContainer: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={classNames("message-container", className)}>{children}</div>
);

export type Props = React.PropsWithChildren<{
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  onCancelClick?: () => void;
}>;

const Modal: React.FC<Props> = ({
  children,
  className,
  footer,
  header,
  onCancelClick,
}) => {
  useHotkeys("esc", () => {
    onCancelClick && onCancelClick();
  });

  const { blockScroll, allowScroll } = useSafeScroll();

  React.useEffect(() => {
    blockScroll();
    return () => allowScroll();
  }, []);

  return (
    <div className="background-mask">
      <div className={classNames(className, "modal-container")}>
        {header ? (
          <div className="modal-header">{header}</div>
        ) : header !== null ? (
          <div className="modal-footer empty" />
        ) : null}
        {children}
        {footer ? (
          <div className="modal-footer">{footer}</div>
        ) : footer !== null ? (
          <div className="modal-footer empty" />
        ) : null}
      </div>
      {onCancelClick && (
        <div className="nav-button top-center close-button">
          <button
            onClick={() => {
              onCancelClick && onCancelClick();
            }}
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
};

export default Modal;
