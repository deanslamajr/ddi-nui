import React from "react";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdLibraryAdd } from "react-icons/md";
import type { LinksFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";
import { HydratedComic, getDirtyComics } from "~/utils/clientCache/comic";

import DraftsModal, {
  links as draftsModalStylesUrl,
} from "~/components/DraftsModal";

export const links: LinksFunction = () => {
  return [...draftsModalStylesUrl()];
};

type Props = {};

export default function CreateNavButton({}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [draftComics, setDraftComics] = React.useState<HydratedComic[]>([]);
  const [showDraftsModal, setShowDraftsModal] = React.useState(false);

  React.useEffect(() => {
    const dirtyComics = getDirtyComics();
    setDraftComics(dirtyComics);
  }, [searchParams, setDraftComics]);

  const onClick = () => {
    if (draftComics.length) {
      setShowDraftsModal(true);
    } else {
      navigate(DDI_APP_PAGES.comicStudio(), { state: { scroll: false } });
    }
  };

  return (
    <>
      <div
        className="nav-button bottom-right accented large-icon"
        onClick={onClick}
      >
        <div className="add-comic-nav-button">
          <TfiPencilAlt className="create-icon" />
          <MdLibraryAdd className="add-icon" size="1.5rem" />
        </div>
      </div>
      {showDraftsModal && (
        <DraftsModal
          draftComics={draftComics}
          onCancelClick={() => setShowDraftsModal(false)}
        />
      )}
    </>
  );
}
