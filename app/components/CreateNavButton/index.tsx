import React from "react";

import type { LinksFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";
import { HydratedComic, getDirtyComics } from "~/utils/clientCache";

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
      // location.href = DDI_APP_PAGES.cellStudio();
      navigate(DDI_APP_PAGES.comicStudio(), { state: { scroll: false } });
    }
  };

  return (
    <>
      <div
        className="nav-button bottom-right accented large-icon"
        onClick={onClick}
      >
        ✏️
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
