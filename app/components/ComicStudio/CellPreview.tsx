import React from "react";
import type { LinksFunction } from "@remix-run/node";

import Cell, { links as cellStylesUrl } from "~/components/Cell";
import { CellFromClientCache } from "~/utils/clientCache/cell";
import { SCHEMA_VERSION } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { getCellState } from "~/contexts/ComicStudioState/selectors";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";

import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

import stylesUrl from "~/styles/components/CellPreview.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const SIDE_BUTTONS_SPACER = 0;
const defaultCellWidth = `${(1 - SIDE_BUTTONS_SPACER) * theme.layout.width}px`;

const CellPreview: React.FC<{
  cellUrlId: string;
  cellWidth?: string;
  isButtonIcon?: boolean;
  onCellClick: (cell: CellFromClientCache) => void;
}> = ({
  cellUrlId,
  cellWidth = defaultCellWidth,
  isButtonIcon,
  onCellClick,
}) => {
  const [comicStudioState] = useComicStudioState();
  const cell = getCellState(comicStudioState, cellUrlId);

  const { imageUrl } = useCellImageGenerator(cell);

  return cell && imageUrl ? (
    isButtonIcon ? (
      <Cell
        clickable
        className="cell-preview-as-icon"
        imageUrl={imageUrl}
        isImageUrlAbsolute={true}
        schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
        cellWidth={cellWidth}
        containerWidth={cellWidth}
      />
    ) : (
      <div onClick={() => onCellClick(cell)}>
        {cell.isDirty && (
          <div className="unpublished-changes">Unpublished Changes</div>
        )}
        <Cell
          clickable
          className="cell-preview-as-studio-cell"
          imageUrl={imageUrl}
          isImageUrlAbsolute={true}
          schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
          caption={cell.studioState?.caption || ""}
          cellWidth={cellWidth}
          containerWidth={cellWidth}
        />
      </div>
    )
  ) : isButtonIcon ? null : (
    <CellWithLoadSpinner />
  );
};

export default CellPreview;
