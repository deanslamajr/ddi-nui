import React from "react";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";

import useSafeScroll from "~/hooks/useSafeScroll";

import stylesUrl from "~/styles/components/Modal.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const CenteredContainer: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={classNames("centered-container", className)}>{children}</div>
);

export const MessageContainer: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={classNames("message-container", className)}>{children}</div>
);

export type Props = {
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  onCancelClick?: () => void;
};

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
        {header && <div className="modal-header">{header}</div>}
        {children}
        {footer ? (
          <div className="modal-footer">{footer}</div>
        ) : (
          <div className="modal-footer empty" />
        )}
      </div>
      {onCancelClick && (
        <div className="nav-button top-center larger-font">
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
