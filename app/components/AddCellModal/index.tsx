import React from "react";
import { LinksFunction } from "remix";

import { CellFromClientCache } from "~/utils/clientCache";

import Modal, {
  CenteredButtons,
  MessageContainer as Message,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton } from "~/components/Button";

import stylesUrl from "~/styles/components/AddCellModal.css";

export const links: LinksFunction = () => {
  return [...modalStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
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
    <Modal className="add-cell-modal" onCancelClick={onCancelClick}>
      <Message>Pick a template!</Message>

      <CenteredButtons>
        <MenuButton onClick={onAddCellFromNewClick}>EMPTY</MenuButton>
      </CenteredButtons>

      <CenteredButtons>
        <MenuButton onClick={onAddCellFromDuplicate}>
          COPY THIS COMIC
        </MenuButton>
      </CenteredButtons>
      <CenteredButtons>
        <MenuButton onClick={onAddCellFromAnotherComic}>
          COPY ANOTHER COMIC
        </MenuButton>
      </CenteredButtons>
    </Modal>
  );
};

export default AddCellModal;
