import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";

import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import Cell, { links as cellStylesUrl } from "~/components/Cell";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

import { DDI_APP_PAGES } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { createNewCell } from "~/utils/clientCache";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";

import useComic from "~/hooks/useComic";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.$copiedComicUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...modalStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export default function CopyFromComicRoute() {
  const navigate = useNavigate();

  const params = useParams();
  const copiedComicUrlId = params.copiedComicUrlId!;
  const comicUrlId = params.comicUrlId!;

  const { comic, isLoading: isLoadingComic } = useComic({
    comicUrlId: copiedComicUrlId,
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
    <Modal
      className="copy-from-comic-modal"
      header={
        isLoadingComic ? undefined : (
          <MessageContainer>Pick a Cell to Copy</MessageContainer>
        )
      }
      onCancelClick={returnToParent}
    >
      <div className="cells-container">
        {isLoadingComic ? (
          <CellWithLoadSpinner />
        ) : (
          cells.map(({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
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
                cellWidth={theme.cell.width}
                clickable
                removeBorders
              />
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
