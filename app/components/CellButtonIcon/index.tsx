import React from "react";
import type { LinksFunction } from "@remix-run/node";

import { SCHEMA_VERSION } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { getCellState } from "~/contexts/ComicStudioState/selectors";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";

import Cell, { links as cellStylesUrl } from "~/components/Cell";

import stylesUrl from "~/styles/components/CellPreview.css";

export const links: LinksFunction = () => {
  return [...cellStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

const SIDE_BUTTONS_SPACER = 0;
const defaultCellWidth = `${(1 - SIDE_BUTTONS_SPACER) * theme.layout.width}px`;

const CellButtonIcon: React.FC<{
  cellUrlId: string;
  cellWidth?: string;
}> = ({ cellUrlId, cellWidth = defaultCellWidth }) => {
  const [comicStudioState] = useComicStudioState();
  const cell = getCellState(comicStudioState, cellUrlId);

  const { imageUrl } = useCellImageGenerator(cell?.studioState || null);

  return cell && imageUrl ? (
    <Cell
      clickable
      className="cell-preview-as-icon"
      imageUrl={imageUrl}
      isImageUrlAbsolute
      schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
      cellWidth={cellWidth}
      containerWidth={cellWidth}
    />
  ) : null;
};

export default CellButtonIcon;
