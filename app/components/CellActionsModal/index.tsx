import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

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

const CellActionsModal: React.FC<{
  cell: CellFromClientCache;
  comicUrlId: string;
  onCancelClick: () => void;
  onDuplicateClick: (studioStateToDuplicate?: StudioState | null) => void;
}> = ({ cell, comicUrlId, onCancelClick, onDuplicateClick }) => {
  const navigate = useNavigate();

  const {
    hasNewImage,
    imageUrl,
    schemaVersion,
    studioState,
    urlId: cellUrlId,
  } = cell;

  const navigateToCellStudio = () => {
    navigate(DDI_APP_PAGES.cellStudio({ comicUrlId, cellUrlId }), {
      state: { scroll: false },
    });
    onCancelClick();
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
