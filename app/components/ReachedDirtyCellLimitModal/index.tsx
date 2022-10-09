import React from "react";
import type { LinksFunction } from "@remix-run/node";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as menuButtonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/ReachedDirtyCellLimitModal.css";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...menuButtonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const ReachedDirtyCellLimitModal: React.FC<{
  onCancelClick: () => void;
  onPublishClick: () => void;
}> = ({ onCancelClick, onPublishClick }) => {
  return (
    <Modal
      header={
        <MessageContainer>
          You've reached the limit of unpublished cells
        </MessageContainer>
      }
      footer={
        <CenteredContainer>
          <MenuButton accented onClick={() => onPublishClick()}>
            PUBLISH
          </MenuButton>
        </CenteredContainer>
      }
      onCancelClick={onCancelClick}
    >
      <MessageContainer className="cell-limit-message">
        Please publish before adding or changing additional cells.
      </MessageContainer>
    </Modal>
  );
};

export default ReachedDirtyCellLimitModal;
