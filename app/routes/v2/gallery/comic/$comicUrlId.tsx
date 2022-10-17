import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useSearchParams, useLoaderData, useNavigate } from "@remix-run/react";

import Modal, { links as modalStylesUrl } from "~/components/Modal";
import Cell, { links as cellStylesUrl } from "~/components/Cell";

import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.$copiedComicUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...modalStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const getCellsFromState = (comic: ComicFromGetComicApi) => {
  const comicsCells = comic?.cells;
  return comicsCells ? sortCellsV4(comicsCells, comic.initialCellUrlId) : [];
};

type ComicFromGetComicApi = {
  comicUpdatedAt: string;
  isActive: boolean;
  initialCellUrlId: string;
  title: string;
  urlId: string;
  userCanEdit: boolean;
  cells: Array<{
    urlId: string;
    imageUrl: string;
    order: null;
    schemaVersion: number;
    studioState: StudioState;
    caption: string;
    previousCellUrlId: string | null;
  }>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const comicUrlId = params.comicUrlId;

  const comicDataResponse = await fetch(
    DDI_API_ENDPOINTS.getComic(comicUrlId!)
  );
  const comicData = await comicDataResponse.json();

  return comicData;
};

export default function ComicViewRoute() {
  const comic = useLoaderData<ComicFromGetComicApi>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? "?" + searchParams.toString()
    : "";

  const cells = getCellsFromState(comic);

  const returnToParent = () => {
    navigate(`${DDI_APP_PAGES.gallery()}${queryString}`, {
      state: { scroll: false },
    });
  };

  return (
    <Modal className="copy-from-comic-modal" onCancelClick={returnToParent}>
      <div className="cells-container">
        {cells.map(({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
          <div
            className="cell-container"
            key={imageUrl}
            onClick={() => {
              console.log("cell clicked");
            }}
          >
            <Cell
              imageUrl={imageUrl || ""}
              isImageUrlAbsolute={Boolean(hasNewImage)}
              schemaVersion={schemaVersion ?? SCHEMA_VERSION}
              caption={studioState?.caption || ""}
              cellWidth={theme.cell.width}
              clickable
              removeBorders
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
