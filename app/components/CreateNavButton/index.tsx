import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";
import { HydratedComic, getDirtyComics } from "~/utils/clientCache/comic";
import AddComicNavButton from "./AddComicNavButton";

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
      <AddComicNavButton location="bottom-right" onClick={onClick} />
      {showDraftsModal && (
        <DraftsModal
          draftComics={draftComics}
          onCancelClick={() => setShowDraftsModal(false)}
        />
      )}
    </>
  );
}
