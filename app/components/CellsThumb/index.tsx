import { FC } from "react";
import styled from "styled-components";

import { getCellImageUrl } from "~/utils/urls";
import Cell from "~/components/Cell";

const CellsCount = styled.div`
  z-index: 999;
  position: absolute;
  top: 0.1rem;
  left: 0.1rem;
  width: 25px;
  height: 25px;
  opacity: 0.75;
  background-color: ${(props) => props.theme.colors.pink};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
`;

const BaseCellImage = styled.img`
  cursor: pointer;

  width: 100%;

  vertical-align: bottom;

  &:hover {
    opacity: 0.8;
  }
`;

const ThumbSchema1: FC<{
  cellsCount: number;
  imageUrl: string;
}> = ({ cellsCount, imageUrl }) => {
  return (
    <>
      {cellsCount > 1 && <CellsCount>{cellsCount}</CellsCount>}
      <BaseCellImage src={imageUrl} />
    </>
  );
};

const CellImage = styled(BaseCellImage)`
  background-color: ${(props) => props.theme.colors.white};
`;

const ThumbLaterSchemas: FC<{
  caption: string;
  cellsCount: number;
  schemaVersion: number;
  imageUrl: string;
}> = ({ caption, cellsCount, schemaVersion, imageUrl }) => {
  return (
    <>
      {cellsCount > 1 && <CellsCount>{cellsCount}</CellsCount>}
      <Cell
        clickable
        removeBorders
        imageUrl={imageUrl}
        isImageUrlAbsolute={schemaVersion > 1}
        schemaVersion={schemaVersion}
        caption={caption}
      />
    </>
  );
};

type Cell = {
  caption: string;
  imageUrl: string;
  schemaVersion: number;
};

export const CellsThumb: FC<{
  cell?: Cell;
  cellsCount: number;
}> = ({ cell, cellsCount }) => {
  if (cell) {
    return cell.schemaVersion === 1 ? (
      <ThumbSchema1 cellsCount={cellsCount} imageUrl={cell.imageUrl} />
    ) : (
      <ThumbSchema1
        cellsCount={cellsCount}
        imageUrl={getCellImageUrl(cell.imageUrl, cell.schemaVersion)}
      />
      // <ThumbLaterSchemas
      //   cellsCount={cellsCount}
      //   imageUrl={getCellUrl(cell.imageUrl, cell.schemaVersion)}
      //   schemaVersion={cell.schemaVersion}
      //   caption={cell.caption}
      // />
    );
  }

  return null;
};
