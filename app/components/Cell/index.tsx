import { FC } from "react";
import styled from "styled-components";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";

import { getCellImageUrl } from "~/utils/urls";
import { theme } from "~/utils/stylesTheme";
import { tabletMax } from "~/components/breakpoints";
import DynamicTextContainer, {
  links as dynamicTextContainerStylesUrl,
} from "~/components/DynamicTextContainer";

import stylesUrl from "~/styles/components/Cell.css";

export const links: LinksFunction = () => {
  return [
    ...dynamicTextContainerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

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

const CellImage = styled.img<{
  cellWidth?: string;
}>`
  width: ${(props) => props.cellWidth || props.theme.cell.width};
  max-width: calc(100vw - ${(props) => props.theme.padding}px);
`;

const Cell: FC<{
  className?: string;
  imageUrl: string;
  isImageUrlAbsolute: boolean;
  caption?: string;
  clickable?: boolean;
  onClick?: () => void;
  removeBorders?: boolean;
  schemaVersion: number;
  cellWidth?: string;
  containerWidth?: string;
}> = ({
  className,
  imageUrl,
  isImageUrlAbsolute,
  caption,
  clickable,
  onClick,
  removeBorders,
  schemaVersion,
  cellWidth,
  containerWidth,
}) => {
  const cellUrl = isImageUrlAbsolute
    ? imageUrl
    : getCellImageUrl(imageUrl, schemaVersion);

  const resolvedWidth = cellWidth
    ? cellWidth
    : removeBorders
    ? theme.cell.fullWidth
    : undefined;

  const cellContainerStyles: React.CSSProperties = {
    marginBottom: schemaVersion === 1 ? "3px" : "1px",
    marginRight: schemaVersion === 1 ? "3px" : "1px",
    padding: schemaVersion === 1 ? "0" : "1px",
    cursor: clickable ? "pointer" : "default",
    background: schemaVersion === 1 ? "inherit" : "var(--lightGray)",
  };

  if (containerWidth) {
    cellContainerStyles.width = containerWidth;
  }

  return (
    <div
      className={classNames("cell-container", className)}
      style={cellContainerStyles}
      onClick={clickable && onClick ? onClick : () => {}}
    >
      {schemaVersion === 1 ? (
        <CellBorder>
          <CellImage
            cellWidth={removeBorders ? theme.cell.fullWidth : undefined}
            src={cellUrl}
          />
        </CellBorder>
      ) : (
        <OldCellBorder width={resolvedWidth}>
          <CellImage cellWidth={resolvedWidth} src={cellUrl} />
          {caption && caption.length && (
            <DynamicTextContainer
              caption={caption}
              captionCssWidth={resolvedWidth}
              fontRatio={16}
            />
          )}
        </OldCellBorder>
      )}
    </div>
  );
};

export default Cell;
