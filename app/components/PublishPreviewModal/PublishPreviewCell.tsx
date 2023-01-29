import React from "react";
import styled from "styled-components";
import type { LinksFunction } from "@remix-run/node";

import { theme } from "~/utils/stylesTheme";
import { SCHEMA_VERSION } from "~/utils/constants";
import { CellFromClientCache } from "~/utils/clientCache/cell";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";
import { getClientVariable } from "~/utils/environment-variables";
import Cell, { links as cellStylesUrl } from "~/components/Cell";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

export const links: LinksFunction = () => {
  return [...cellStylesUrl(), ...cellWithLoadSpinnerStylesUrl()];
};

const StudioCell = styled(Cell)<{ widthOverride: number }>`
  margin: 0 auto;
  width: ${(props) => props.widthOverride}px;
`;

const PublishPreviewCell: React.FC<{ cell: CellFromClientCache }> = ({
  cell,
}) => {
  const { imageUrl: generatedImageUrl, isLoading } = useCellImageGenerator(
    cell?.studioState || null,
    !cell.hasNewImage
  );

  const imageUrl = cell.hasNewImage
    ? generatedImageUrl ||
      `${getClientVariable("ASSETS_URL_WITH_PROTOCOL")}/error.png`
    : cell.imageUrl!;
  return (
    <div className="cell-container" key={cell.urlId}>
      {isLoading ? (
        <CellWithLoadSpinner />
      ) : (
        <StudioCell
          cellWidth={theme.cell.width}
          imageUrl={imageUrl}
          isImageUrlAbsolute={Boolean(cell.hasNewImage)}
          schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
          caption={cell.studioState?.caption}
          widthOverride={theme.layout.width}
          removeBorders
        />
      )}
    </div>
  );
};

export default PublishPreviewCell;
