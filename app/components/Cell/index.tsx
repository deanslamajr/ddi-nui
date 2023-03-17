import { FC, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";

import { getCellImageUrl } from "~/utils/urls";
import { theme } from "~/utils/stylesTheme";
import { tabletMax } from "~/components/breakpoints";
import DynamicTextContainer, {
  links as dynamicTextContainerStylesUrl,
} from "~/components/DynamicTextContainer";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";
import stylesUrl from "~/styles/components/Cell.css";
import { StudioState } from "~/interfaces/studioState";

export const links: LinksFunction = () => {
  return [
    ...dynamicTextContainerStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

// function calcHeight(value: string) {
//   let numberOfLineBreaks = (value.match(/\n/g) || []).length;
//   // min-height + lines x line-height + padding + border
//   let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
//   return newHeight;
// }

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

const Cell: FC<
  {
    className?: string;
    caption?: string;
    clickable?: boolean;
    onClick?: () => void;
    removeBorders?: boolean;
    schemaVersion: number;
    cellWidth?: string;
    containerWidth?: string;
    onCaptionClick?: React.MouseEventHandler<HTMLDivElement>;
    isEditingCaption?: boolean;
    setIsEditingCaption?: React.Dispatch<React.SetStateAction<boolean>>;
  } & (
    | {
        imageUrl: string;
        isImageUrlAbsolute: boolean;
      }
    | {
        studioState: StudioState;
      }
  )
> = (props) => {
  const {
    className,
    caption,
    clickable,
    onClick,
    removeBorders,
    schemaVersion,
    cellWidth,
    containerWidth,
    onCaptionClick,
    isEditingCaption,
    setIsEditingCaption,
  } = props;

  const [thing, setThing] = useState(false);
  useEffect(() => {
    setThing((thing) => !thing);
  }, [isEditingCaption]);

  const textInput = useRef<HTMLTextAreaElement>(null);
  const [localCaption, setLocalCaption] = useState(caption || "");

  const cellUrlFromDb =
    "isImageUrlAbsolute" in props
      ? props.isImageUrlAbsolute
        ? props.imageUrl
        : getCellImageUrl(props.imageUrl, schemaVersion)
      : null;

  const { imageUrl: cellUrlFromGenerator, isLoading } = useCellImageGenerator(
    "studioState" in props ? props.studioState || null : null
  );

  const resolvedWidth = cellWidth
    ? cellWidth
    : removeBorders
    ? theme.cell.fullWidth
    : undefined;

  const cellContainerStyles: React.CSSProperties = {
    marginBottom: schemaVersion === 1 ? "3px" : "1px",
    // marginRight: schemaVersion === 1 ? "3px" : "1px",
    padding: schemaVersion === 1 ? "0" : "1px",
    cursor: clickable ? "pointer" : "default",
    // background: schemaVersion === 1 ? "inherit" : "var(--lightGray)",
  };

  if (containerWidth) {
    cellContainerStyles.width = containerWidth;
  }

  if (isLoading) {
    return <CellWithLoadSpinner />;
  }

  const doesCaptionExist = caption && caption.length;

  const textAreaCssHeight: React.CSSProperties | undefined = textInput.current
    ?.scrollHeight
    ? {
        height: `${textInput.current?.scrollHeight - 10}px`,
      }
    : undefined;

  console.log("textInput", textInput);

  console.log("textAreaCssHeight", textAreaCssHeight);

  // textarea.addEventListener("keyup", () => {
  //   textarea.style.height = calcHeight(textarea.value) + "px";
  // });
  console.log("document", document);

  return cellUrlFromDb || cellUrlFromGenerator ? (
    <div
      className={classNames("cell-container", className)}
      style={cellContainerStyles}
      onClick={clickable && onClick ? onClick : () => {}}
    >
      {schemaVersion === 1 ? (
        <CellBorder>
          <CellImage
            cellWidth={removeBorders ? theme.cell.fullWidth : undefined}
            src={cellUrlFromDb || cellUrlFromGenerator!}
          />
        </CellBorder>
      ) : (
        <OldCellBorder width={resolvedWidth}>
          <CellImage
            cellWidth={resolvedWidth}
            src={cellUrlFromDb || cellUrlFromGenerator!}
          />
          {doesCaptionExist && isEditingCaption ? (
            <div>
              <textarea
                style={textAreaCssHeight}
                ref={textInput}
                className="editing-caption"
                onClick={(e) => e.stopPropagation()} // stopPropagation prevents the navigation to cell studio
                value={localCaption}
                onChange={(e) => {
                  console.log("onChange", e.target.value);
                  setLocalCaption(e.target.value);
                }}
              />
              <input
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingCaption && setIsEditingCaption((prev) => !prev);
                }}
                value="close"
              />
            </div>
          ) : (
            <DynamicTextContainer
              onClick={onCaptionClick}
              caption={caption}
              captionCssWidth={resolvedWidth}
              fontRatio={16}
            />
          )}
        </OldCellBorder>
      )}
    </div>
  ) : null;
};

export default Cell;
