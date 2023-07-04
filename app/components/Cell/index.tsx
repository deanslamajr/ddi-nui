import { FC, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";
import { TfiSave } from "react-icons/tfi";
import { BsTrash3Fill } from "react-icons/bs";
import { ImUndo2 } from "react-icons/im";

import { getCellImageUrl } from "~/utils/urls";
import { theme } from "~/utils/stylesTheme";
import { tabletMax } from "~/components/breakpoints";
import DynamicTextContainer, {
  links as dynamicTextContainerStylesUrl,
} from "~/components/DynamicTextContainer";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import CellActions, { links as cellActionsStylesUrl } from "./CellActions";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { updateCellCaption } from "~/contexts/ComicStudioState/actions";
import { StudioState } from "~/interfaces/studioState";
import stylesUrl from "~/styles/components/Cell.css";

export const links: LinksFunction = () => {
  return [
    ...dynamicTextContainerStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    ...buttonStylesUrl(),
    ...cellActionsStylesUrl(),
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
    cellWidth?: string;
    containerWidth?: string;
    isCaptionEditable?: boolean;
    onAddCellClick?: () => void;
    onClick?: () => void;
    removeBorders?: boolean;
    schemaVersion: number;
    showAddCellButton?: boolean;
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
    cellWidth,
    containerWidth,
    isCaptionEditable,
    onAddCellClick,
    onClick,
    removeBorders,
    schemaVersion,
    showAddCellButton,
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

  const clearCaption = () => {
    setLocalCaption("");
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

  return cellUrlFromDb || cellUrlFromGenerator ? (
    <>
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
            {(caption || isEditingCaption) && (
              <div className="caption-padding">
                {isEditingCaption ? (
                  <div
                    ref={growWrapDivRef}
                    className="grow-wrap"
                    data-caption
                    style={captionFontSizeStyles}
                  >
                    <textarea
                      rows={1}
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
                ) : (
                  <DynamicTextContainer
                    onClick={
                      isCaptionEditable
                        ? (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                            e.stopPropagation();
                            setIsEditingCaption((prev) => !prev);
                          }
                        : undefined
                    }
                    caption={caption}
                    fontRatio={16}
                    setConsumersFontSize={setCaptionFontSize}
                  />
                )}
              </div>
            )}
          </OldCellBorder>
        )}
      </div>
      {!isEditingCaption && (
        <CellActions
          showAddCaptionButton={Boolean(isCaptionEditable && !caption)}
          showAddCellButton={Boolean(showAddCellButton)}
          onAddCellClick={onAddCellClick}
          onEditCaptionClick={() => setIsEditingCaption(true)}
        />
      )}
      {isEditingCaption && (
        <div className="caption-edit-buttons">
          <div className="button-row">
            <MenuButton
              className="cell-action-button"
              onClick={() => endCaptionEdit(true)}
            >
              <ImUndo2 size="1.5rem" />
            </MenuButton>
            <MenuButton
              className="cell-action-button secondary"
              onClick={() => clearCaption()}
              noSpinner
            >
              <BsTrash3Fill size="1.5rem" />
            </MenuButton>
            <MenuButton
              accented
              className="cell-action-button"
              onClick={() => {
                // e.stopPropagation();
                if (!cellUrlId) {
                  console.error("cellUrlId does not exist");
                  endCaptionEdit(true);
                  return;
                }

                dispatch(updateCellCaption(cellUrlId, localCaption));
                endCaptionEdit();
              }}
            >
              <TfiSave size="1.5rem" />
            </MenuButton>
          </div>
        </div>
      )}
    </>
  ) : null;
};

export default Cell;
