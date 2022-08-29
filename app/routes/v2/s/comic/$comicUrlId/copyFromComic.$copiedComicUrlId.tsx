import type { LinksFunction } from "remix";
import { useParams, useNavigate } from "@remix-run/react";

import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import Cell from "~/components/Cell";

import { DDI_APP_PAGES } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { createNewCell } from "~/utils/clientCache";
import { sortCellsV4 } from "~/utils/sortCells";

import useComic from "~/hooks/useComic";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.css";

export const links: LinksFunction = () => {
  return [...modalStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

export default function CopyFromComicRoute() {
  const navigate = useNavigate();

  const params = useParams();
  const copiedComicUrlId = params.copiedComicUrlId!;
  const comicUrlId = params.comicUrlId!;

  const comic = useComic({
    comicUrlId: copiedComicUrlId,
    onError: () => console.error("CopyFromComicRoute broke!"),
  });

  const getCellsFromState = () => {
    const comicsCells = comic?.cells;

    return comicsCells
      ? sortCellsV4(Object.values(comicsCells), comic.initialCellUrlId)
      : [];
  };

  const cells = getCellsFromState();

  const returnToParent = () => {
    navigate("..");
  };

  const navigateToAddCellFromDuplicate = (studioState?: StudioState | null) => {
    const newCell = createNewCell({
      comicUrlId: comicUrlId,
      initialStudioState: studioState,
    });

    location.assign(DDI_APP_PAGES.cellStudio(newCell.urlId));
  };

  return (
    <Modal className="copy-from-comic-modal" onCancelClick={returnToParent}>
      <MessageContainer>Pick a cell to duplicate:</MessageContainer>
      <div className="cells-container">
        {cells.map(({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
          <div
            className="cell-container"
            key={imageUrl}
            onClick={() => navigateToAddCellFromDuplicate(studioState)}
          >
            <Cell
              imageUrl={imageUrl || ""}
              isImageUrlAbsolute={Boolean(hasNewImage)}
              schemaVersion={schemaVersion ?? SCHEMA_VERSION}
              caption={studioState?.caption || ""}
              cellWidth="250px"
              clickable
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
