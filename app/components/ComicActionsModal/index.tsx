import React from "react";
import { LinksFunction } from "remix";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, PinkMenuButton } from "~/components/Button";

export const links: LinksFunction = () => {
  return [...modalStylesUrl()];
};

type Props = {
  isComicDirty: boolean;
  onCancelClick: () => void;
  onDeleteClick: () => void;
  onPublishClick: () => void;
};

const ComicActionsModal: React.FC<Props> = ({
  isComicDirty,
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
              <MenuButton onClick={() => setCurrentView("DELETE_WARNING")}>
                DELETE
              </MenuButton>
            </CenteredContainer>
            {isComicDirty && (
              <CenteredContainer>
                <PinkMenuButton onClick={() => onPublishClick()}>
                  PUBLISH
                </PinkMenuButton>
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
