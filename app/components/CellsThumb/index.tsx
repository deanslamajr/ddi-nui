import { LinksFunction } from "remix";
import { FC } from "react";

import { getCellImageUrl } from "~/utils/urls";
// import Cell from "~/components/Cell";

import stylesUrl from "./cells-thumb.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const ThumbSchema1: FC<{
  cellsCount: number;
  imageUrl: string;
}> = ({ cellsCount, imageUrl }) => {
  return (
    <>
      {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
      <img className="base-cell-image" src={imageUrl} />
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
