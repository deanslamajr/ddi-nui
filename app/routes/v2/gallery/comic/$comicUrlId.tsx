import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useParams, useLoaderData, useNavigate } from "@remix-run/react";

import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import Cell, { links as cellStylesUrl } from "~/components/Cell";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { createNewCell } from "~/utils/clientCache";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";

import useComic from "~/hooks/useComic";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.$copiedComicUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...modalStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
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
    studioState: object;
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

  // const params = useParams();
  // const comicUrlId = params.comicUrlId!;
  // const { comic, isLoading: isLoadingComic } = useComic({
  //   comicUrlId,
  // });

  const getCellsFromState = () => {
    const comicsCells = comic?.cells;

    return comicsCells
      ? sortCellsV4(Object.values(comicsCells), comic.initialCellUrlId)
      : [];
  };

  const cells = getCellsFromState();

  const returnToParent = () => {
    navigate("..");
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
