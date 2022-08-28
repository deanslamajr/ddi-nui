import type { LinksFunction } from "remix";
import { useLoaderData } from "remix";
import { useParams, useNavigate } from "@remix-run/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import Modal, {
  CenteredButtons,
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import Cell from "~/components/Cell";
import { MenuButton } from "~/components/Button";

import { DDI_API_ENDPOINTS, DDI_APP_PAGES } from "~/utils/urls";
import { MAX_DIRTY_CELLS, SCHEMA_VERSION } from "~/utils/constants";
import sortComics from "~/utils/sortComics";
import {
  // createComicFromPublishedComic,
  CellFromClientCache,
  createNewCell,
  deleteComic,
  doesComicUrlIdExist,
  hydrateComicFromClientCache,
  HydratedComic,
} from "~/utils/clientCache";
import { sortCellsV4 } from "~/utils/sortCells";

import useComic from "~/hooks/useComic";

import {
  getLatestTimestamp,
  setLatestTimestamp,
} from "~/utils/__clientCache/latestTimestamp";

import { Comic } from "~/interfaces/comic";
import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/copyFromComic.css";

export const links: LinksFunction = () => {
  return [...modalStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

export default function CopyFromComicRoute() {
  const navigate = useNavigate();

  const params = useParams();
  const copiedComicUrlId = params.copiedComicUrlId!;
  const comicUrlId = params.comicUrlId!;

  const comic = useComic({
    comicUrlId: copiedComicUrlId,
    onError: () => console.error("CopyFromComicRoute broke!"),
  });

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

  const navigateToAddCellFromDuplicate = (studioState?: StudioState | null) => {
    const newCell = createNewCell({
      comicUrlId: comicUrlId,
      initialStudioState: studioState,
    });

    // this.props.showSpinner()
    // this.hideAddCellModal()
    // Router.pushRoute(`/s/cell/${newCell}`)
    location.replace(DDI_APP_PAGES.cellStudio(newCell.urlId));
  };

  return (
    <Modal className="copy-from-comic" onCancelClick={returnToParent}>
      <MessageContainer>Pick a cell to duplicate:</MessageContainer>
      <div className="cells-container">
        {cells.map(({ hasNewImage, imageUrl, schemaVersion, studioState }) => (
          <div
            className="cell-container"
            key={imageUrl}
            onClick={() => navigateToAddCellFromDuplicate(studioState)}
          >
            <Cell
              imageUrl={imageUrl || ""}
              isImageUrlAbsolute={Boolean(hasNewImage)}
              schemaVersion={schemaVersion ?? SCHEMA_VERSION}
              caption={studioState?.caption || ""}
              cellWidth="250px"
              clickable
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
