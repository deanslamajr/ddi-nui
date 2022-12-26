import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";
import shortid from "shortid";
import Modal, { links as modalStylesUrl } from "~/components/Modal";
import { DDI_APP_PAGES } from "~/utils/urls";
import { getStudioState } from "~/utils/clientCache";

import CellStudio, {
  links as cellStudioStylesUrl,
} from "~/components/CellStudio";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/cell/$cellUrlId.css";
import { StudioState } from "~/interfaces/studioState";

export const links: LinksFunction = () => {
  return [
    ...cellStudioStylesUrl(),
    ...modalStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

/**
 * MAIN
 */
export default function CellStudioRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [initialStudioState, setInitialStudioState] =
    React.useState<StudioState | null>(null);

  const comicUrlId = params.comicUrlId!;
  const cellUrlId = params.cellUrlId!;

  React.useEffect(() => {
    const studioStateFromCache = getStudioState(comicUrlId, cellUrlId);
    setInitialStudioState(studioStateFromCache);
  }, [comicUrlId, cellUrlId, setInitialStudioState]);

  console.log("cellUrlId", cellUrlId);

  const navigateToComicStudioPage = () => {
    // @TODO: replace this with a hash from the undo/redo change mgmt system
    const updateHash = shortid.generate();
    const comicStudioPageUrl = DDI_APP_PAGES.comicStudio({
      comicUrlId,
      lastUpdateHash: updateHash,
    });
    navigate(comicStudioPageUrl, {
      state: { scroll: false },
    });
  };

  return (
    <>
      <Modal
        header={null}
        footer={null}
        onCancelClick={navigateToComicStudioPage}
        className="cell-studio-modal"
      >
        <CellStudio
          cellUrlId={cellUrlId}
          initialStudioState={initialStudioState}
        />
      </Modal>
    </>
  );
}

export const unstable_shouldReload = () => false;
