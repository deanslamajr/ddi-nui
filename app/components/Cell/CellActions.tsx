import { FC } from "react";
import { LinksFunction } from "@remix-run/node";
import { MdOutlineAddComment } from "react-icons/md";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl()];
};

const CellActions: FC<{
  showAddCaptionButton: boolean;
  showAddCellButton: boolean;
  onAddCellClick?: () => void;
  onEditCaptionClick: () => void;
}> = ({
  showAddCaptionButton,
  showAddCellButton,
  onAddCellClick,
  onEditCaptionClick,
}) => {
  if (!showAddCaptionButton && !showAddCellButton) {
    return null;
  }

  return showAddCellButton && showAddCaptionButton ? (
    <div className="button-row">
      <MenuButton className="cell-action-button" onClick={onEditCaptionClick}>
        <MdOutlineAddComment size="2rem" />
      </MenuButton>
      <MenuButton
        accented={true}
        className="add-cell-button"
        onClick={() => onAddCellClick && onAddCellClick()}
      >
        +
      </MenuButton>
    </div>
  ) : showAddCaptionButton ? (
    <MenuButton className="cell-action-button" onClick={onEditCaptionClick}>
      <MdOutlineAddComment size="2rem" />
    </MenuButton>
  ) : (
    <MenuButton
      accented={true}
      className="add-cell-button"
      onClick={() => onAddCellClick && onAddCellClick()}
    >
      +
    </MenuButton>
  );
};

export default CellActions;
