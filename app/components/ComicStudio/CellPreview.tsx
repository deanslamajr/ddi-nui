import React from "react";
import type { LinksFunction } from "@remix-run/node";
import useDeepCompareEffect from "use-deep-compare-effect";

import { generateCellImage } from "~/utils/generateCellImageFromEmojis";

import Cell, { links as cellStylesUrl } from "~/components/Cell";
import { CellFromClientCache } from "~/utils/clientCache";
import { SCHEMA_VERSION } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { getCellState } from "~/contexts/ComicStudioState/selectors";
import { useComicStudioState } from "~/contexts/ComicStudioState";

import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

import stylesUrl from "~/styles/components/ComicStudio.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const SIDE_BUTTONS_SPACER = 0;
const cellWidth = `${(1 - SIDE_BUTTONS_SPACER) * theme.layout.width}px`;

const CellPreview: React.FC<{
  cellUrlId: string;
  onCellClick: (cell: CellFromClientCache) => void;
}> = ({ cellUrlId, onCellClick }) => {
  const [comicStudioState] = useComicStudioState();
  const cell = getCellState(comicStudioState, cellUrlId);

  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<
    string | null
  >(null);

  useDeepCompareEffect(() => {
    if (cell) {
      generateCellImage(cell).then(({ url: latestImageUrl }) =>
        setGeneratedImageUrl(latestImageUrl)
      );
    }
  }, [cell]);

  return cell && generatedImageUrl ? (
    <div onClick={() => onCellClick(cell)}>
      {cell.isDirty && (
        <div className="unpublished-changes">Unpublished Changes</div>
      )}
      <Cell
        clickable
        className="studio-cell"
        imageUrl={generatedImageUrl || ""}
        isImageUrlAbsolute={true}
        schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
        caption={cell.studioState?.caption || ""}
        cellWidth={cellWidth}
        containerWidth={cellWidth}
      />
    </div>
  ) : (
    <CellWithLoadSpinner />
  );
};

export default CellPreview;
