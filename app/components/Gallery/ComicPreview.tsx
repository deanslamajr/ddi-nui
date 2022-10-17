import type { LinksFunction } from "@remix-run/node";
import { FC, useState } from "react";

import { Comic } from "~/interfaces/comic";

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

type Props = {
  cellsCount: number;
  initialCell: Comic["initialCell"];
  generateComicLink: (comicUrlId: string) => string;
  urlId: string;
};

const ComicPreview: FC<Props> = ({
  cellsCount,
  initialCell,
  generateComicLink,
  urlId,
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
        <CellsThumb cell={initialCell} cellsCount={cellsCount} />
      )}
    </UnstyledLink>
  );
};

export default ComicPreview;
