import React from "react";
import { LinksFunction } from "remix";
import classNames from "classnames";

import useSafeScroll from "~/hooks/useSafeScroll";

import stylesUrl from "~/styles/components/Modal.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const CenteredButtons: React.FC<{}> = ({ children }) => (
  <div className="centered-button">{children}</div>
);

export const MessageContainer: React.FC<{}> = ({ children }) => (
  <div className="message-container">{children}</div>
);

export type Props = {
  className?: string;
  onCancelClick?: () => void;
};

const Modal: React.FC<Props> = ({ children, className, onCancelClick }) => {
  const { blockScroll, allowScroll, isScrollBlocked } = useSafeScroll();

  React.useEffect(() => {
    blockScroll();
  }, [isScrollBlocked]);

  return (
    <div className="background-mask">
      <div className={classNames(className, "modal-container")}>
        {onCancelClick && (
          <div className="nav-button top-center larger-font">
            <button
              onClick={() => {
                allowScroll();
                onCancelClick();
              }}
            >
              ❌
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
