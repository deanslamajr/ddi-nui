import React from "react";
import type { LinksFunction } from "@remix-run/node";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

export const links: LinksFunction = () => {
  return [...modalStylesUrl(), ...buttonStylesUrl()];
};

const ComicActionsModal: React.FC<{
  isComicDirty: boolean;
  onAddCellClick: () => void;
  onCancelClick: () => void;
  onDeleteClick: () => void;
  onPublishClick: () => void;
}> = ({
  isComicDirty,
  onAddCellClick,
  onCancelClick,
  onDeleteClick,
  onPublishClick,
}) => {
  const [currentView, setCurrentView] = React.useState<
    "MAIN" | "DELETE_WARNING"
  >("MAIN");

  return (
    <Modal
      header={
        currentView === "DELETE_WARNING" ? (
          <MessageContainer>
            Are you sure you want to delete this comic?
          </MessageContainer>
        ) : (
          <MessageContainer>Comic Actions</MessageContainer>
        )
      }
      footer={
        currentView === "DELETE_WARNING" ? (
          <CenteredContainer>
            <MenuButton onClick={onDeleteClick}>DELETE</MenuButton>
          </CenteredContainer>
        ) : (
          <div>
            <CenteredContainer>
              <MenuButton onClick={() => onAddCellClick()}>ADD CELL</MenuButton>
            </CenteredContainer>
            <CenteredContainer>
              <MenuButton onClick={() => setCurrentView("DELETE_WARNING")}>
                DELETE
              </MenuButton>
            </CenteredContainer>
            {isComicDirty && (
              <CenteredContainer>
                <MenuButton accented onClick={() => onPublishClick()}>
                  PUBLISH
                </MenuButton>
              </CenteredContainer>
            )}
          </div>
        )
      }
      onCancelClick={onCancelClick}
    />
  );
};

export default ComicActionsModal;
