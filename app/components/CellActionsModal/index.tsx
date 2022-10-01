import React from "react";
import { LinksFunction } from "remix";

import Cell, { links as cellStylesUrl } from "~/components/Cell";
import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import { SCHEMA_VERSION } from "~/utils/constants";
import { CellFromClientCache } from "~/utils/clientCache";
import { DDI_APP_PAGES } from "~/utils/urls";
import { theme } from "~/utils/stylesTheme";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/components/CellActionsModal.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...modalStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
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
    <Modal
      header={<MessageContainer>Cell Actions</MessageContainer>}
      footer={
        <>
          <CenteredContainer>
            <MenuButton
              accented
              onClick={() => {
                navigateToCellStudio();
              }}
            >
              EDIT
            </MenuButton>
          </CenteredContainer>
          <CenteredContainer>
            <MenuButton onClick={() => onDuplicateClick(studioState)}>
              COPY
            </MenuButton>
          </CenteredContainer>
        </>
      }
      onCancelClick={onCancelClick}
    >
      <div className="cell-preview-container">
        <Cell
          cellWidth={theme.cell.width}
          imageUrl={imageUrl || ""}
          isImageUrlAbsolute={Boolean(hasNewImage)}
          schemaVersion={schemaVersion ?? SCHEMA_VERSION}
          caption={studioState?.caption || ""}
          removeBorders
        />
      </div>
    </Modal>
  );
};

export default CellActionsModal;
