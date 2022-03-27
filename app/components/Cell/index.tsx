import { FC } from "react";
import styled from "styled-components";

import { getCellImageUrl } from "~/utils/urls";
import { theme } from "~/utils/stylesTheme";
import { tabletMax } from "~/components/breakpoints";
import { DynamicTextContainer } from "~/components/DynamicTextContainer";

const CellContainer = styled.div<{
  schemaVersion: number;
  clickable: boolean;
}>`
  margin: 0;
  margin-bottom: ${(props) => (props.schemaVersion === 1 ? "3px" : "1px")};
  margin-right: ${(props) => (props.schemaVersion === 1 ? "3px" : "1px")};
  padding: ${(props) => (props.schemaVersion === 1 ? "0" : "1px")};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  background: ${(props) =>
    props.schemaVersion === 1 ? "inherit" : `${props.theme.colors.lightGray}`};

  ${tabletMax`
    margin-bottom: 0;
    margin-right: 0;
  `}
`;

const CellBorder = styled.div`
  padding: 0;
  background: ${(props) => props.theme.colors.white};
  height: 100%;

  ${tabletMax`
    background: ${(props) => props.theme.colors.lightGray};
  `}
`;

const getTemplateRows = (width: string): string => {
  if (width === theme.cell.fullWidth) {
    return "inherit";
  }

  return width || theme.cell.width;
};

const OldCellBorder = styled.div<{
  width?: string;
}>`
  /* to normalize the height of the caption between shorter and taller comics on the same row */
  background: rgb(255, 250, 249);
  display: grid;
  height: 100%;
  width: ${(props) => props.width || props.theme.cell.width};
  max-width: calc(100vw - ${(props) => props.theme.padding}px);
  grid-template-rows: ${(props) =>
    getTemplateRows(props.width || props.theme.cell.width)};

  ${tabletMax`
    grid-template-rows: inherit;
  `}
`;

const CellImageContainer = styled.div<{
  width?: string;
}>`
  width: ${(props) => props.width || props.theme.cell.width};
  max-width: calc(100vw - ${(props) => props.theme.padding}px);
  height: 257px;
`;

const Cell: FC<{
  className?: string;
  imageUrl: string;
  isImageUrlAbsolute: boolean;
  caption: string;
  clickable: boolean;
  onClick?: () => void;
  removeBorders: boolean;
  schemaVersion: number;
  width?: string;
}> = ({
  className,
  imageUrl,
  isImageUrlAbsolute,
  caption,
  clickable,
  onClick,
  removeBorders,
  schemaVersion,
  width,
}) => {
  const cellUrl = isImageUrlAbsolute
    ? imageUrl
    : getCellImageUrl(imageUrl, schemaVersion);

  const resolvedWidth = width
    ? width
    : removeBorders
    ? theme.cell.fullWidth
    : undefined;

  return (
    <CellContainer
      className={className}
      clickable={clickable}
      onClick={clickable && onClick ? onClick : () => {}}
      schemaVersion={schemaVersion}
    >
      {schemaVersion === 1 ? (
        <CellBorder>
          <CellImageContainer
            width={removeBorders ? theme.cell.fullWidth : undefined}
          >
            <img src={cellUrl} />
          </CellImageContainer>
        </CellBorder>
      ) : (
        <OldCellBorder width={resolvedWidth}>
          <CellImageContainer width={resolvedWidth}>
            <img src={cellUrl} />
          </CellImageContainer>
          {caption && caption.length && (
            <DynamicTextContainer fontRatio={17}>
              {caption}
            </DynamicTextContainer>
          )}
        </OldCellBorder>
      )}
    </CellContainer>
  );
};

export default Cell;
