import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";
import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
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
    const comicStudioPageUrl = DDI_APP_PAGES.comicStudio(comicUrlId);
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
        className="within-modal"
      >
        <CellStudio initialStudioState={initialStudioState} />
      </Modal>
    </>
  );
}

export const unstable_shouldReload = () => false;
