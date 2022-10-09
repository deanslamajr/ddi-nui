import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { CellFromClientCache } from "~/utils/clientCache";

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

type Props = {
  cells: CellFromClientCache[];
  onAddCellFromNewClick: () => void;
  onAddCellFromAnotherComic: () => void;
  onAddCellFromDuplicate: () => void;
  onCancelClick: () => void;
};

const AddCellModal: React.FC<Props> = ({
  onAddCellFromNewClick,
  onAddCellFromAnotherComic,
  onAddCellFromDuplicate,
  onCancelClick,
}) => {
  return (
    <Modal
      className="add-cell-modal"
      header={<Message>Add a New Cell</Message>}
      footer={
        <>
          <div className="description">choose a starter template</div>
          <CenteredContainer>
            <MenuButton onClick={onAddCellFromNewClick}>EMPTY</MenuButton>
          </CenteredContainer>

          <CenteredContainer>
            <MenuButton onClick={onAddCellFromDuplicate}>
              COPY THIS COMIC
            </MenuButton>
          </CenteredContainer>
          <CenteredContainer>
            <MenuButton onClick={onAddCellFromAnotherComic}>
              COPY ANOTHER COMIC
            </MenuButton>
          </CenteredContainer>
        </>
      }
      onCancelClick={onCancelClick}
    ></Modal>
  );
};

export default AddCellModal;
