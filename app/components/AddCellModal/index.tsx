import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { CellFromClientCache } from "~/utils/clientCache/cell";

import Modal, {
  CenteredContainer,
  MessageContainer as Message,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/AddCellModal.css";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const AddCellModal: React.FC<{
  cells: CellFromClientCache[];
  onAddCellFromNewClick: () => void;
  onAddCellFromAnotherComic: () => void;
  onAddCellFromDuplicate: () => void;
  onCancelClick: () => void;
  titleOverride?: string;
}> = ({
  cells,
  onAddCellFromNewClick,
  onAddCellFromAnotherComic,
  onAddCellFromDuplicate,
  onCancelClick,
  titleOverride,
}) => {
  return (
    <Modal
      className="add-cell-modal"
      header={<Message>{titleOverride || "Add a New Cell"}</Message>}
      footer={
        <>
          <div className="description">choose a starter template</div>
          <CenteredContainer>
            <MenuButton onClick={onAddCellFromNewClick}>EMPTY</MenuButton>
          </CenteredContainer>

          {cells.length > 0 && (
            <CenteredContainer>
              <MenuButton onClick={onAddCellFromDuplicate}>
                COPY FROM THIS COMIC
              </MenuButton>
            </CenteredContainer>
          )}

          <CenteredContainer>
            <MenuButton onClick={onAddCellFromAnotherComic}>
              COPY FROM ANOTHER COMIC
            </MenuButton>
          </CenteredContainer>
        </>
      }
      onCancelClick={onCancelClick}
    ></Modal>
  );
};

export default AddCellModal;
