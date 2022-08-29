import React from "react";
import styled from "styled-components";
import { LinksFunction } from "remix";

import Modal, {
  CenteredButtons,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, PinkMenuButton } from "~/components/Button";

export const links: LinksFunction = () => {
  return [...modalStylesUrl()];
};

const HomeModal = styled(Modal)`
  width: 315px;
  height: inherit;
`;

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
    <HomeModal onCancelClick={onCancelClick}>
      {currentView === "MAIN" && (
        <>
          <CenteredButtons>
            <MenuButton onClick={() => setCurrentView("DELETE_WARNING")}>
              DELETE
            </MenuButton>
          </CenteredButtons>
          {isComicDirty && (
            <CenteredButtons>
              <PinkMenuButton onClick={() => onPublishClick()}>
                PUBLISH
              </PinkMenuButton>
            </CenteredButtons>
          )}
        </>
      )}
      {currentView === "DELETE_WARNING" && (
        <>
          <MessageContainer>
            Are you sure you want to delete this comic?
          </MessageContainer>
          <CenteredButtons>
            <MenuButton onClick={onDeleteClick}>DELETE</MenuButton>
          </CenteredButtons>
        </>
      )}
    </HomeModal>
  );
};

export default ComicActionsModal;
