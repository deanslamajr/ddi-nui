import React from "react";
import { useNavigate } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import Modal, {
  links as modalStylesUrl,
  MessageContainer,
} from "~/components/Modal";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import Cell, { links as cellStylesUrl } from "~/components/Cell";
import AddComicNavButton from "../CreateNavButton/AddComicNavButton";
import {
  ComicStudioStateProvider,
  links as comicStudioStateProviderStylesUrl,
} from "~/contexts/ComicStudioState";
import { CellFromClientCache } from "~/utils/clientCache/cell";
import useHydrateComic from "~/hooks/useHydrateComic";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";
import { HydratedComic } from "~/utils/clientCache/comic";
import { DDI_APP_PAGES } from "~/utils/urls";
import { SCHEMA_VERSION } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";
import { getClientVariable } from "~/utils/environment-variables";

import stylesUrl from "~/styles/components/DraftsModal.css";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    ...cellStylesUrl(),
    ...comicStudioStateProviderStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const DraftComicPreviewCell: React.FC<{ cell: CellFromClientCache }> = ({
  cell,
}) => {
  const { imageUrl: generatedImageUrl, isLoading } = useCellImageGenerator(
    cell?.studioState || null,
    !cell.hasNewImage
  );

  const imageUrl = cell.hasNewImage
    ? generatedImageUrl ||
      `${getClientVariable("ASSETS_URL_WITH_PROTOCOL")}/error.png`
    : cell.imageUrl!;

  return isLoading ? (
    <CellWithLoadSpinner />
  ) : (
    <Cell
      imageUrl={imageUrl}
      isImageUrlAbsolute={Boolean(cell.hasNewImage)}
      schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
      caption={cell.studioState?.caption || ""}
      cellWidth={theme.cell.width}
      clickable
      removeBorders
    />
  );
};

const DraftComicPreview: React.FC<{
  comic: HydratedComic;
  selectedComicUrlId: string | null;
  onClick: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ comic, selectedComicUrlId, onClick }) => {
  const navigate = useNavigate();
  const { comic: hydratedComic, isHydrating: isHydratingComic } =
    useHydrateComic({
      comicUrlId: comic.urlId,
      onError: () => {
        console.error(
          `Error occurred while trying to hydrate draft comic with comicUrlId:${comic.urlId}`
        );
      },
    });

  if (isHydratingComic) {
    return <CellWithLoadSpinner />;
  }

  if (hydratedComic === null || hydratedComic.cells === null) {
    return null;
  }

  const cells = Object.values(hydratedComic.cells);
  const initialCell = cells[0];
  const cellsCount = cells.length;

  return (
    <ComicStudioStateProvider comicUrlId={comic.urlId}>
      <div
        className="cell-container"
        key={comic.urlId}
        onClick={() => {
          if (selectedComicUrlId === null) {
            onClick(comic.urlId);
            navigate(
              DDI_APP_PAGES.comicStudio({ comicUrlId: hydratedComic.urlId }),
              {
                state: { scroll: false },
              }
            );
          }
        }}
      >
        {selectedComicUrlId === hydratedComic.urlId ? (
          <CellWithLoadSpinner />
        ) : (
          <>
            {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
            <DraftComicPreviewCell cell={initialCell} />
          </>
        )}
      </div>
    </ComicStudioStateProvider>
  );
};

const DraftsModal: React.FC<{
  draftComics: HydratedComic[];
  onCancelClick: () => void;
}> = ({ draftComics, onCancelClick }) => {
  const navigate = useNavigate();
  const [selectedComicUrlId, setSelectedComicUrlId] = React.useState<
    string | null
  >(null);
  return (
    <>
      <Modal
        shouldRenderCloseButtonOutsideHeader
        header={<MessageContainer>Drafts</MessageContainer>}
        footer={null}
        onCancelClick={onCancelClick}
        fullHeight
      >
        <div className="cells-container">
          {draftComics.map((draftComic) =>
            selectedComicUrlId === draftComic.urlId ? (
              <CellWithLoadSpinner key={`${draftComic.urlId}-loader`} />
            ) : (
              <DraftComicPreview
                key={draftComic.urlId}
                comic={draftComic}
                selectedComicUrlId={selectedComicUrlId}
                onClick={setSelectedComicUrlId}
              />
            )
          )}
        </div>
        <AddComicNavButton
          location="top-right"
          onClick={() => {
            navigate(DDI_APP_PAGES.comicStudio(), {
              state: { scroll: false },
            });
          }}
        />
      </Modal>
    </>
  );
};

export default DraftsModal;
