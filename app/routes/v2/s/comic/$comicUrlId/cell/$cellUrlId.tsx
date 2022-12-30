import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";
import Modal, { links as modalStylesUrl } from "~/components/Modal";
import { DDI_APP_PAGES } from "~/utils/urls";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { getCellState } from "~/contexts/ComicStudioState/selectors";
// import { hasUndo } from "~/utils/studioStateMachine";

import CellStudio, {
  links as cellStudioStylesUrl,
} from "~/components/CellStudio";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/cell/$cellUrlId.css";

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
  const navigate = useNavigate();

  const params = useParams();
  const comicUrlId = params.comicUrlId!;
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellState = getCellState(comicStudioState, cellUrlId);

  const navigateToComicStudioPage = () => {
    const comicStudioPageUrl = DDI_APP_PAGES.comicStudio({
      comicUrlId,
    });
    navigate(comicStudioPageUrl, {
      state: { scroll: false },
    });
  };

  return (
    <>
      <div className="nav-button top-right large-icon">
        <button onClick={() => /*undo(true)*/ {}}>↶</button>
      </div>
      <div className="nav-button top-right large-icon">
        <button onClick={() => /*redo(true)*/ {}}>↷</button>
      </div>
      <Modal
        header={null}
        footer={null}
        onCancelClick={navigateToComicStudioPage}
        className="cell-studio-modal"
      >
        {cellState?.studioState && (
          <CellStudio
            cellStudioState={cellState.studioState}
            cellUrlId={cellUrlId}
          />
        )}
      </Modal>
    </>
  );
}

export const unstable_shouldReload = () => false;
