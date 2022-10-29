import type {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useParams,
  useSearchParams,
  useLoaderData,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import classNames from "classnames";

import Modal, {
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import Cell, { links as cellStylesUrl } from "~/components/Cell";

import { DDI_APP_PAGES, DDI_API_ENDPOINTS, isUrlAbsolute } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { sortCellsFromGetComic } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";
import getClientCookies from "~/utils/getClientCookiesForFetch";

import { ComicFromGetComicApi } from "~/interfaces/comic";
import { StudioStateFromGetComic } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/gallery/comic/$comicUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...modalStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const getSortedCells = (comic: ComicFromGetComicApi) => {
  const comicsCells = comic?.cells;
  return comicsCells ? sortCellsFromGetComic(comic) : [];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const comicUrlId = params.comicUrlId;

  const comicDataResponse = await fetch(
    DDI_API_ENDPOINTS.getComic(comicUrlId!),
    getClientCookies(request)
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
  const params = useParams();
  const comicUrlId = params.comicUrlId!;

  const navigate = useNavigate();

  const comic: ComicFromGetComicApi = useLoaderData<ComicFromGetComicApi>();
  console.log("comic from loader:", comic);

  const cells = getSortedCells(comic);

  const { hash } = useLocation();
  const isCellSelected = Boolean(hash);

  return (
    <ThisPagesModal>
      <div className="cells-container">
        {cells.map(({ caption, imageUrl, schemaVersion, urlId: cellUrlId }) => (
          <div
            id={cellUrlId}
            className={classNames("cell-container", {
              "not-selected": isCellSelected && "#" + cellUrlId !== hash,
            })}
            key={imageUrl}
            onClick={() => {
              navigate(DDI_APP_PAGES.cell(comicUrlId, cellUrlId));
            }}
          >
            <Cell
              imageUrl={imageUrl || ""}
              isImageUrlAbsolute={isUrlAbsolute(imageUrl || "")}
              schemaVersion={schemaVersion ?? SCHEMA_VERSION}
              caption={caption || ""}
              cellWidth={theme.cell.width}
              clickable
              removeBorders
            />
          </div>
        ))}
      </div>
      {comic.userCanEdit && (
        <div className="nav-button bottom-right">
          <button
            onClick={() => navigate(DDI_APP_PAGES.comicStudio(comicUrlId))}
          >
            ✍️
          </button>
        </div>
      )}
    </ThisPagesModal>
  );
}
