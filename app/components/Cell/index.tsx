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
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { updateCellCaption } from "~/contexts/ComicStudioState/actions";
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
    cellUrlId?: string;
    className?: string;
    caption?: string;
    clickable?: boolean;
    onClick?: () => void;
    removeBorders?: boolean;
    schemaVersion: number;
    cellWidth?: string;
    containerWidth?: string;
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
    cellUrlId,
    className,
    caption,
    clickable,
    onClick,
    removeBorders,
    schemaVersion,
    cellWidth,
    containerWidth,
  } = props;

  const [_comicStudioState, dispatch] = useComicStudioState();

  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const growWrapDivRef = useRef<HTMLDivElement>(null);
  const [localCaption, setLocalCaption] = useState(caption || "");

  useEffect(() => {
    if (growWrapDivRef?.current?.dataset) {
      growWrapDivRef.current.dataset.caption = localCaption;
    }
    if (isEditingCaption) {
      textInput.current?.focus();
    }
  }, [isEditingCaption, localCaption]);

  const [captionFontSize, setCaptionFontSize] = useState<number | null>(null);

  const endCaptionEdit = (shouldResetLocalCaption?: boolean) => {
    if (shouldResetLocalCaption) {
      setLocalCaption(caption || "");
    }
    setIsEditingCaption && setIsEditingCaption((prev) => !prev);
  };

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
    padding: schemaVersion === 1 ? "0" : "1px",
    cursor: clickable ? "pointer" : "default",
  };

  if (containerWidth) {
    cellContainerStyles.width = containerWidth;
  }

  const captionFontSizeStyles: React.CSSProperties = {
    fontSize: captionFontSize ? `${captionFontSize}px` : "inherit",
  };

  if (isLoading) {
    return <CellWithLoadSpinner />;
  }

  const doesCaptionExist = caption && caption.length;

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
          <div className="caption-padding">
            {doesCaptionExist && isEditingCaption ? (
              <>
                <div
                  ref={growWrapDivRef}
                  className="grow-wrap"
                  data-caption
                  style={captionFontSizeStyles}
                >
                  <textarea
                    rows={undefined}
                    style={captionFontSizeStyles}
                    ref={textInput}
                    className="editing-caption"
                    onClick={(e) => e.stopPropagation()} // stopPropagation prevents the navigation to cell studio
                    value={localCaption}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setLocalCaption(newValue);
                    }}
                  />
                </div>
                <input
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    endCaptionEdit(true);
                  }}
                  value="Cancel"
                />
                <input
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!cellUrlId) {
                      console.error("cellUrlId does not exist");
                      endCaptionEdit(true);
                      return;
                    }

                    dispatch(updateCellCaption(cellUrlId, localCaption));
                    endCaptionEdit();
                  }}
                  value="Save"
                />
              </>
            ) : (
              <DynamicTextContainer
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  e.stopPropagation();
                  setIsEditingCaption((prev) => !prev);
                }}
                caption={caption}
                fontRatio={16}
                setConsumersFontSize={setCaptionFontSize}
              />
            )}
          </div>
        </OldCellBorder>
      )}
    </div>
  ) : null;
};

export default Cell;
