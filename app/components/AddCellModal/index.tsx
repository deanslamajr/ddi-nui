import React, { useState } from "react";
import styled from "styled-components";
import { LinksFunction } from "remix";

import { CellFromClientCache } from "~/utils/clientCache";
import { SCHEMA_VERSION } from "~/utils/constants";
// import {SCHEMA_VERSION} from '../../../config/constants.json';

import Modal, {
  CenteredButtons,
  MessageContainer as Message,
  links as modalStylesUrl,
} from "~/components/Modal";
// import Modal, { CenteredButtons, MessageContainer as Message } from '../../../components/Modal'
import { MenuButton } from "~/components/Button";
// import { MenuButton } from '../../../components/Buttons'
import Cell from "~/components/Cell";
// import Cell from '../../../components/Cell'
import { phoneMax, tabletMax } from "~/components/breakpoints";
// import { media } from '../../../helpers/style-utils'

import { StudioState } from "~/interfaces/studioState";

export const links: LinksFunction = () => {
  return [...modalStylesUrl()];
};

const DuplicateModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 500px;

  ${phoneMax`
    max-width: 100vw;
  `}
  ${tabletMax`
  width: 100%;
    
  `}
`;

const HomeModal = styled(Modal)`
  width: 315px;
`;

const CellsContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 80%;
  margin: 2rem auto;
  width: 270px;
  max-width: calc(100vw - ${(props) => props.theme.padding}px);
`;

const CellContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  cursor: pointer;
`;

const MessageContainer = styled(Message)`
  margin-top: 1.5rem;
`;

type Props = {
  cells: CellFromClientCache[];
  onAddCellFromNewClick: () => void;
  onAddCellFromAnotherComic: () => void;
  onAddCellFromDuplicate: (studioStateToDuplicate?: StudioState | null) => void;
  onCancelClick: () => void;
};

const AddCellModal: React.FC<Props> = ({
  cells,
  onAddCellFromNewClick,
  onAddCellFromAnotherComic,
  onAddCellFromDuplicate,
  onCancelClick,
}) => {
  const [currentView, setCurrentView] = useState<
    "HOME" | "CELL_LIST" | "COMIC_LIST"
  >("HOME");

  return (
    <>
      {currentView === "HOME" && (
        <HomeModal onCancelClick={onCancelClick}>
          <Message>Pick a template!</Message>

          <CenteredButtons>
            <MenuButton onClick={onAddCellFromNewClick}>EMPTY</MenuButton>
          </CenteredButtons>

          <CenteredButtons>
            <MenuButton onClick={() => setCurrentView("CELL_LIST")}>
              COPY THIS COMIC
            </MenuButton>
          </CenteredButtons>
          <CenteredButtons>
            <MenuButton onClick={onAddCellFromAnotherComic}>
              COPY ANOTHER COMIC
            </MenuButton>
          </CenteredButtons>
        </HomeModal>
      )}
      {currentView === "CELL_LIST" && (
        <DuplicateModal>
          <MessageContainer>Pick a cell to duplicate:</MessageContainer>
          <CellsContainer>
            {cells.map(
              ({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
                <CellContainer
                  key={imageUrl}
                  onClick={() => onAddCellFromDuplicate(studioState)}
                >
                  <Cell
                    imageUrl={imageUrl || ""}
                    isImageUrlAbsolute={Boolean(hasNewImage)}
                    schemaVersion={schemaVersion ?? SCHEMA_VERSION}
                    caption={studioState?.caption || ""}
                    cellWidth="250px"
                    clickable
                  />
                </CellContainer>
              )
            )}
          </CellsContainer>
          <CenteredButtons>
            <MenuButton onClick={() => setCurrentView("HOME")}>BACK</MenuButton>
          </CenteredButtons>
        </DuplicateModal>
      )}
      {currentView === "COMIC_LIST" && (
        <DuplicateModal>
          <MessageContainer>Pick a cell to duplicate:</MessageContainer>
          <CellsContainer>
            {cells.map(
              ({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
                <CellContainer
                  key={imageUrl}
                  onClick={() => onAddCellFromDuplicate(studioState)}
                >
                  <Cell
                    imageUrl={imageUrl || ""}
                    isImageUrlAbsolute={Boolean(hasNewImage)}
                    schemaVersion={schemaVersion ?? SCHEMA_VERSION}
                    caption={studioState?.caption || ""}
                    cellWidth="250px"
                    clickable
                  />
                </CellContainer>
              )
            )}
          </CellsContainer>
          <CenteredButtons>
            <MenuButton onClick={() => setCurrentView("HOME")}>BACK</MenuButton>
          </CenteredButtons>
        </DuplicateModal>
      )}
    </>
  );
};

export default AddCellModal;
