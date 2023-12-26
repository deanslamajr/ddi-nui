import type { LinksFunction } from "@remix-run/node";
import { FC, useState } from "react";

import { ComicFromGalleryQueries } from "~/interfaces/comic";

import CellsThumb, {
  links as cellsThumbStylesUrl,
} from "~/components/CellsThumb";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

export const links: LinksFunction = () => {
  return [
    ...cellsThumbStylesUrl(),
    ...unstyledLinkStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
  ];
};

const ComicPreview: FC<{
  cellsCount: number;
  initialCell: ComicFromGalleryQueries["initialCell"];
  generateComicLink: (comicUrlId: string) => string;
  urlId: string;
  isDebugProdCell?: boolean;
}> = ({
  cellsCount,
  initialCell,
  generateComicLink,
  urlId,
  isDebugProdCell,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <UnstyledLink
      id={urlId}
      href={generateComicLink(urlId)}
      onclick={() => {
        setIsClicked(true);
        setInterval(() => setIsClicked(false), 1000);
      }}
      isRemixLink
      state={{ scroll: false }}
    >
      {isClicked ? (
        <CellWithLoadSpinner />
      ) : (
        <CellsThumb
          cell={initialCell}
          cellsCount={cellsCount}
          isDebugProdCell={isDebugProdCell}
        />
      )}
    </UnstyledLink>
  );
};

export default ComicPreview;
