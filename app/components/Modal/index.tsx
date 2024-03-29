import React from "react";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";
import { IoMdClose } from "react-icons/io";

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

export const CellsContainer: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={classNames("cells-container", className)}>{children}</div>
);

export type Props = React.PropsWithChildren<{
  className?: string;
  footer?: React.ReactNode;
  shouldRenderCloseButtonOutsideHeader?: boolean;
  header?: React.ReactNode;
  onCancelClick?: () => void;
  fullHeight?: boolean;
}>;

const Modal: React.FC<Props> = ({
  children,
  className,
  footer,
  fullHeight,
  header,
  onCancelClick,
  shouldRenderCloseButtonOutsideHeader,
}) => {
  useHotkeys("esc", () => {
    onCancelClick && onCancelClick();
  });

  const { blockScroll, allowScroll } = useSafeScroll();

  React.useEffect(() => {
    blockScroll();
    return () => allowScroll();
  }, []);

  const renderHeader = () =>
    onCancelClick ? (
      <div className="nav-button top-left close-button">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onCancelClick && onCancelClick();
          }}
        >
          <IoMdClose size="2rem" />
        </button>
      </div>
    ) : null;

  return (
    <div
      className="background-mask"
      onClick={(event) => {
        event.stopPropagation();
        event.currentTarget === event.target &&
          onCancelClick &&
          onCancelClick();
      }}
    >
      <div
        className={classNames(className, "modal-container", {
          ["full-height"]: fullHeight,
        })}
      >
        {(shouldRenderCloseButtonOutsideHeader || !header) && renderHeader()}
        {header ? (
          <div className="modal-header">
            <>
              {!shouldRenderCloseButtonOutsideHeader && renderHeader()}
              {header}
            </>
          </div>
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
    </div>
  );
};

export default Modal;
