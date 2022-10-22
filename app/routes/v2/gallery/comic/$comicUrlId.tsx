import type {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSearchParams, useLoaderData, useNavigate } from "@remix-run/react";
import classNames from "classnames";

import Modal, {
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import Cell, { links as cellStylesUrl } from "~/components/Cell";

import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/gallery/comic/$comicUrlId.css";

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

  if (!comicDataResponse.ok) {
    if (comicDataResponse.status === 404) {
      throw new Error(
        `404: Could not find comic with comicUrlId:${comicUrlId}`
      );
    }
    throw new Error(`HTTP error! Status: ${comicDataResponse.status}`);
  }

  const comicData = await comicDataResponse.json();

  return json(comicData);
};

const ThisPagesModal: React.FC<{ isError?: boolean }> = ({
  children,
  isError,
}) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString()
    ? "?" + searchParams.toString()
    : "";

  const returnToParent = () => {
    navigate(`${DDI_APP_PAGES.gallery()}${queryString}`, {
      state: { scroll: false },
    });
  };

  return (
    <Modal
      className={classNames({ "comic-view-modal": !isError })}
      onCancelClick={returnToParent}
      header={isError && children}
    >
      {!isError && children}
    </Modal>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <ThisPagesModal isError>
      <MessageContainer>
        Sorry, the requested comic does not seem to exist.
      </MessageContainer>
    </ThisPagesModal>
  );
};

export default function ComicViewRoute() {
  const comic = useLoaderData<ComicFromGetComicApi>();

  const cells = getCellsFromState(comic);

  return (
    <ThisPagesModal>
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
    </ThisPagesModal>
  );
}
