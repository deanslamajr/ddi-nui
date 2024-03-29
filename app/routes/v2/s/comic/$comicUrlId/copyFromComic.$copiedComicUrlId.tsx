import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";
import React from "react";

import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import Cell, { links as cellStylesUrl } from "~/components/Cell";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import { DDI_APP_PAGES } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { createNewCell } from "~/utils/clientCache/cell";
import { theme } from "~/utils/stylesTheme";
import { CellImageProvider } from "~/contexts/CellImageGenerator";
import useHydrateComic from "~/hooks/useHydrateComic";

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

export default function CopyFromComicRoute() {
  const [selectedCellUrlId, setSelectedCellUrlId] = React.useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const params = useParams();
  const copiedComicUrlId = params.copiedComicUrlId!;
  const comicUrlId = params.comicUrlId!;

  const { comic, isHydrating: isLoadingComic } = useHydrateComic({
    comicUrlId: copiedComicUrlId,
    shouldUpdateCache: false,
    onError: () => console.log("There was an error loading this comic!"),
  });

  const getCellsFromState = () => {
    return Object.values(comic?.cells || {}) || [];
  };

  const cells = getCellsFromState();

  const returnToParent = () => {
    navigate("..", {
      state: { scroll: false },
    });
  };

  const navigateToAddCellFromDuplicate = (studioState?: StudioState | null) => {
    const newCell = createNewCell({
      comicUrlId: comicUrlId !== "new" ? comicUrlId : undefined,
      initialStudioState: studioState,
    });

    location.assign(
      DDI_APP_PAGES.cellStudio({
        comicUrlId: newCell.comicUrlId,
        cellUrlId: newCell.urlId,
      })
    );
  };

  return (
    <Modal
      shouldRenderCloseButtonOutsideHeader
      fullHeight
      className="copy-from-comic-modal"
      header={
        isLoadingComic ? undefined : (
          <MessageContainer>Pick a Cell to Copy</MessageContainer>
        )
      }
      footer={null}
      onCancelClick={returnToParent}
    >
      <CellImageProvider>
        <div className="cells-container">
          {isLoadingComic ? (
            <CellWithLoadSpinner />
          ) : (
            cells.map(
              ({
                hasNewImage,
                imageUrl,
                schemaVersion,
                studioState,
                urlId,
              }) => {
                const sharedCellProps = {
                  schemaVersion: schemaVersion ?? SCHEMA_VERSION,
                  caption: studioState?.caption || "",
                  cellWidth: theme.cell.width,
                  clickable: true,
                  removeBorders: true,
                };

                return selectedCellUrlId !== null ? (
                  <CellWithLoadSpinner key={urlId} />
                ) : (
                  <div
                    className="cell-container"
                    key={urlId}
                    onClick={() => {
                      setSelectedCellUrlId(imageUrl || "");
                      navigateToAddCellFromDuplicate(studioState);
                    }}
                  >
                    {Boolean(imageUrl && !hasNewImage) ? (
                      <Cell
                        {...sharedCellProps}
                        imageUrl={imageUrl || ""}
                        isImageUrlAbsolute={false}
                      />
                    ) : (
                      studioState && (
                        <Cell {...sharedCellProps} studioState={studioState} />
                      )
                    )}
                  </div>
                );
              }
            )
          )}
        </div>
      </CellImageProvider>
    </Modal>
  );
}
