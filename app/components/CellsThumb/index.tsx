import { LinksFunction } from "remix";
import { FC } from "react";
import { Img } from "react-image";

import { getCellImageUrl } from "~/utils/urls";
import { getClientVariable } from "~/utils/environment-variables";
import isServerContext from "~/utils/isServerContext";

import { DynamicTextContainer } from "../DynamicTextContainer";

import stylesUrl from "./cells-thumb.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const ThumbSchema1: FC<{
  caption?: string;
  cellsCount: number;
  imageUrl: string;
}> = ({ caption, cellsCount, imageUrl }) => {
  const isPreview = true;
  const showLoader = isServerContext();

  const captionWithBreaks = caption
    ? caption.split("\n").map((item, key) => {
        return (
          <span key={key}>
            {item}
            <br />
          </span>
        );
      })
    : [null];

  return (
    <>
      {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
      {caption && (
        <DynamicTextContainer fontRatio={14} isPreview={isPreview}>
          {/* {caption} */}
          {isPreview ? captionWithBreaks[0] : captionWithBreaks}
        </DynamicTextContainer>
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
