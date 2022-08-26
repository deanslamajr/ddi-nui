import React from "react";
import styled from "styled-components";

// import { Router } from '../../../routes'

import Cell from "~/components/Cell";
import Modal, { CenteredButtons } from "~/components/Modal";
import { PinkMenuButton } from "~/components/Button";

import { SCHEMA_VERSION } from "~/utils/constants";
import { CellFromClientCache } from "~/utils/clientCache";
import { DDI_APP_PAGES } from "~/utils/urls";

const HomeModal = styled(Modal)`
  width: 315px;
  height: inherit;
`;

const CellPreview = styled(Cell)`
  margin-bottom: 1rem;
`;

export type Props = {
  cell: CellFromClientCache;
  onCancelClick: () => void;
};

const CellActionsModal: React.FC<Props> = ({ cell, onCancelClick }) => {
  const { hasNewImage, imageUrl, schemaVersion, studioState, urlId } = cell;

  const navigateToCellStudio = () => {
    // Router.pushRoute(`/s/cell/${this.props.cell.urlId}`);
    location.href = DDI_APP_PAGES.getCreateNewCellPageUrl(urlId);
  };

  return (
    <HomeModal onCancelClick={onCancelClick}>
      <CellPreview
        imageUrl={imageUrl || ""}
        isImageUrlAbsolute={Boolean(hasNewImage)}
        schemaVersion={schemaVersion ?? SCHEMA_VERSION}
        caption={studioState?.caption || ""}
        removeBorders
      />
      <CenteredButtons>
        <PinkMenuButton onClick={navigateToCellStudio}>EDIT</PinkMenuButton>
      </CenteredButtons>
    </HomeModal>
  );
};

export default CellActionsModal;
