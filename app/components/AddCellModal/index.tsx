import React, { useState } from "react";
import styled from "styled-components";

import { CellFromClientCache } from "~/utils/clientCache";
import { SCHEMA_VERSION } from "~/utils/constants";
// import {SCHEMA_VERSION} from '../../../config/constants.json';

import Modal, {
  CenteredButtons,
  MessageContainer as Message,
} from "~/components/Modal";
// import Modal, { CenteredButtons, MessageContainer as Message } from '../../../components/Modal'
import { MenuButton } from "~/components/Button";
// import { MenuButton } from '../../../components/Buttons'
import Cell from "~/components/Cell";
// import Cell from '../../../components/Cell'
import { phoneMax, tabletMax } from "~/components/breakpoints";
// import { media } from '../../../helpers/style-utils'

import { StudioState } from "~/interfaces/studioState";

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
  onAddCellFromDuplicate: (studioStateToDuplicate?: StudioState | null) => void;
  onCancelClick: () => void;
};

const AddCellModal: React.FC<Props> = ({
  cells,
  onAddCellFromNewClick,
  onAddCellFromDuplicate,
  onCancelClick,
}) => {
  const [currentView, setCurrentView] = useState<"HOME" | "CELL_LIST">("HOME");

  return currentView === "HOME" ? (
    <HomeModal onCancelClick={onCancelClick}>
      <Message>Add a new cell</Message>

      <CenteredButtons>
        <MenuButton onClick={() => setCurrentView("CELL_LIST")}>
          FROM DUPLICATE
        </MenuButton>
      </CenteredButtons>
      <CenteredButtons>
        <MenuButton onClick={onAddCellFromNewClick}>FROM NEW</MenuButton>
      </CenteredButtons>
    </HomeModal>
  ) : (
    <DuplicateModal>
      <MessageContainer>Pick a cell to duplicate:</MessageContainer>
      <CellsContainer>
        {cells.map(({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
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
        ))}
      </CellsContainer>
      <CenteredButtons>
        <MenuButton onClick={() => setCurrentView("HOME")}>BACK</MenuButton>
      </CenteredButtons>
    </DuplicateModal>
  );
};

export default AddCellModal;
