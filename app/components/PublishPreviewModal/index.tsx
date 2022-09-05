import React from "react";
import styled from "styled-components";

import Cell from "~/components/Cell";
import Modal, { CenteredButtons, MessageContainer } from "~/components/Modal";
import { PinkMenuButton } from "~/components/Button";

import { theme } from "~/utils/stylesTheme";
import { SCHEMA_VERSION } from "~/utils/constants";
import { CellFromClientCache } from "~/utils/clientCache";

const HomeModal = styled(Modal)`
  width: 315px;
  height: inherit;
`;

const StudioCell = styled(Cell)<{ widthOverride: number }>`
  margin: 0 auto;
  width: ${(props) => props.widthOverride}px;
`;

const CellsContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 70vh;
  margin: 2rem auto;
  width: 270px;
  max-width: calc(100vw - ${(props) => props.theme.padding}px);
`;
const CellContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
`;

const PublishPreviewModal: React.FC<{
  cells: CellFromClientCache[];
  onCancelClick: () => void;
  onPublishClick: () => void;
}> = ({ cells, onCancelClick, onPublishClick }) => {
  return (
    <HomeModal onCancelClick={onCancelClick}>
      <MessageContainer>Publish this comic?</MessageContainer>

      <CellsContainer>
        {cells.map((cell) => (
          <CellContainer key={cell.imageUrl}>
            <StudioCell
              imageUrl={cell.imageUrl!}
              isImageUrlAbsolute={Boolean(cell.hasNewImage)}
              schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
              caption={cell.studioState?.caption}
              widthOverride={theme.layout.width}
            />
          </CellContainer>
        ))}
      </CellsContainer>

      <CenteredButtons>
        <PinkMenuButton onClick={onPublishClick}>PUBLISH</PinkMenuButton>
      </CenteredButtons>
    </HomeModal>
  );
};

export default PublishPreviewModal;
