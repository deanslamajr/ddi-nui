import { FC } from "react";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdLibraryAdd } from "react-icons/md";
import classnames from "classnames";

const AddComicNavButton: FC<{
  location: "bottom-right" | "top-right";
  onClick: () => void;
}> = ({ location, onClick }) => {
  return (
    <div
      className={classnames(
        "nav-button accented large-icon",
        { "bottom-right": location === "bottom-right" },
        { "top-right": location === "top-right" }
      )}
      onClick={() => onClick()}
    >
      <div className="add-comic-nav-button">
        <TfiPencilAlt className="create-icon" />
        <MdLibraryAdd className="add-icon" size="1.5rem" />
      </div>
    </div>
  );
};

export default AddComicNavButton;
