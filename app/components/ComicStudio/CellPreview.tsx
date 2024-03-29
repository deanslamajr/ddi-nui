import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { CellFromClientCache } from "~/utils/clientCache/cell";
import { SCHEMA_VERSION } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { getCellState } from "~/contexts/ComicStudioState/selectors";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";

import Cell, { links as cellStylesUrl } from "~/components/Cell";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/CellPreview.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const SIDE_BUTTONS_SPACER = 0;
const defaultCellWidth = `${(1 - SIDE_BUTTONS_SPACER) * theme.layout.width}px`;

const CellPreview: React.FC<{
  cellUrlId: string;
  cellWidth?: string;
  onAddCellClick: () => void;
  onCellClick?: (cell: CellFromClientCache) => void;
  showAddCellButton: boolean;
}> = ({
  cellUrlId,
  cellWidth = defaultCellWidth,
  onAddCellClick,
  onCellClick,
  showAddCellButton,
}) => {
  const [comicStudioState] = useComicStudioState();
  const cell = getCellState(comicStudioState, cellUrlId);

  const { imageUrl } = useCellImageGenerator(cell?.studioState || null);

  return (
    <>
      {cell && imageUrl ? (
        <>
          <div
            className="cell-preview-container"
            onClick={() => onCellClick && onCellClick(cell)}
          >
            {cell.isDirty && (
              <div className="unpublished-changes">Unpublished Changes</div>
            )}
            <Cell
              clickable
              cellUrlId={cell.urlId}
              className="cell-preview-as-studio-cell"
              imageUrl={imageUrl}
              isCaptionEditable
              isImageUrlAbsolute
              schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
              caption={cell.studioState?.caption || ""}
              cellWidth={cellWidth}
              containerWidth={cellWidth}
              showAddCellButton={showAddCellButton}
              onAddCellClick={onAddCellClick}
            />
          </div>
        </>
      ) : (
        <CellWithLoadSpinner />
      )}
    </>
  );
};

export default CellPreview;
