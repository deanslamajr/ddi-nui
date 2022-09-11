import React from "react";
import { LinksFunction } from "remix";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { PinkMenuButton } from "~/components/Button";

import stylesUrl from "~/styles/components/ReachedDirtyCellLimitModal.css";

export const links: LinksFunction = () => {
  return [...modalStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
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
          <PinkMenuButton onClick={() => onPublishClick()}>
            PUBLISH
          </PinkMenuButton>
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
