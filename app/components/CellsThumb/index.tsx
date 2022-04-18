import { LinksFunction } from "remix";
import { FC } from "react";
import { Img } from "react-image";

import { getCellImageUrl } from "~/utils/urls";
import { getClientVariable } from "~/utils/environment-variables";
import isServerContext from "~/utils/isServerContext";

// import Cell from "~/components/Cell";

import stylesUrl from "./cells-thumb.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const ThumbSchema1: FC<{
  cellsCount: number;
  imageUrl: string;
}> = ({ cellsCount, imageUrl }) => {
  const showLoader = isServerContext();

  return (
    <>
      {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
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

// const ThumbEarlierSchemas: FC<{
//   caption: string;
//   cellsCount: number;
//   schemaVersion: number;
//   imageUrl: string;
// }> = ({ caption, cellsCount, schemaVersion, imageUrl }) => {
//   return (
//     <>
//       {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
//       <Cell
//         clickable
//         removeBorders
//         imageUrl={imageUrl}
//         isImageUrlAbsolute={schemaVersion > 1}
//         schemaVersion={schemaVersion}
//         caption={caption}
//       />
//     </>
//   );
// };

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
    return cell.schemaVersion === 1 ? (
      <ThumbSchema1 cellsCount={cellsCount} imageUrl={cell.imageUrl} />
    ) : (
      <ThumbSchema1
        cellsCount={cellsCount}
        imageUrl={getCellImageUrl(cell.imageUrl, cell.schemaVersion)}
      />
      // <ThumbEarlierSchemas
      //   cellsCount={cellsCount}
      //   imageUrl={getCellUrl(cell.imageUrl, cell.schemaVersion)}
      //   schemaVersion={cell.schemaVersion}
      //   caption={cell.caption}
      // />
    );
  }

  return null;
};

export default CellsThumb;
