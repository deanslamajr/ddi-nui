import React from "react";
import styled from "styled-components";
import { LinksFunction } from "remix";

import Cell from "~/components/Cell";
import Modal, {
  CenteredButtons,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, PinkMenuButton } from "~/components/Button";

import { SCHEMA_VERSION } from "~/utils/constants";
import { CellFromClientCache } from "~/utils/clientCache";
import { DDI_APP_PAGES } from "~/utils/urls";

import { StudioState } from "~/interfaces/studioState";

const HomeModal = styled(Modal)`
  width: 315px;
  height: inherit;
`;

const CellPreview = styled(Cell)`
  margin-bottom: 1rem;
`;

export const links: LinksFunction = () => {
  return [...modalStylesUrl()];
};

export type Props = {
  cell: CellFromClientCache;
  onCancelClick: () => void;
  onDuplicateClick: (studioStateToDuplicate?: StudioState | null) => void;
};

const CellActionsModal: React.FC<Props> = ({
  cell,
  onCancelClick,
  onDuplicateClick,
}) => {
  const { hasNewImage, imageUrl, schemaVersion, studioState, urlId } = cell;

  const navigateToCellStudio = () => {
    location.href = DDI_APP_PAGES.cellStudio(urlId);
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
      <CenteredButtons>
        <MenuButton onClick={() => onDuplicateClick(studioState)}>
          DUPLICATE
        </MenuButton>
      </CenteredButtons>
    </HomeModal>
  );
};

export default CellActionsModal;
