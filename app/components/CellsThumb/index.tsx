import type { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { Img } from "react-image";

import { getCellImageUrl } from "~/utils/urls";
import { getClientVariable } from "~/utils/environment-variables";
import isServerContext from "~/utils/isServerContext";

import DynamicTextContainer, {
  links as dynamicTextContainerStylesUrl,
} from "~/components/DynamicTextContainer";

import stylesUrl from "~/styles/components/CellsThumb.css";

export const links: LinksFunction = () => {
  return [
    ...dynamicTextContainerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const ThumbSchema1: FC<{
  caption?: string;
  cellsCount: number;
  imageUrl: string;
}> = ({ caption, cellsCount, imageUrl }) => {
  const isPreview = true;
  const showLoader = isServerContext();

  return (
    <>
      {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
      {caption && (
        <DynamicTextContainer
          caption={caption}
          fontRatio={16}
          isPreview={isPreview}
          // This width is for gallery views, might break in other views
          // 2px accounts for the grid-gap of 2px in gallery views
          captionCssWidth="100% - 2px"
        />
      )}
      {showLoader ? (
        <img
          className="base-cell-image"
          src={`${getClientVariable("ASSETS_URL_WITH_PROTOCOL")}/loading.png`}
          alt="Loading image"
        />
      ) : (
        <Img
          className="base-cell-image"
          src={imageUrl}
          loader={
            <img
              className="base-cell-image"
              src={`${getClientVariable(
                "ASSETS_URL_WITH_PROTOCOL"
              )}/loading.png`}
              alt="Loading image"
            />
          }
          unloader={
            <img
              className="base-cell-image"
              src={`${getClientVariable("ASSETS_URL_WITH_PROTOCOL")}/error.png`}
              alt="Cannot load image"
            />
          }
        />
      )}
    </>
  );
};

type Cell = {
  caption: string;
  imageUrl: string;
  schemaVersion: number;
};

const CellsThumb: FC<{
  cell?: Cell;
  cellsCount: number;
}> = ({ cell, cellsCount }) => {
  if (cell) {
    const imageUrl =
      cell.schemaVersion === 1
        ? cell.imageUrl
        : getCellImageUrl(cell.imageUrl, cell.schemaVersion);

    return (
      <ThumbSchema1
        caption={cell.caption}
        cellsCount={cellsCount}
        imageUrl={imageUrl}
      />
    );
  }

  return null;
};

export default CellsThumb;
