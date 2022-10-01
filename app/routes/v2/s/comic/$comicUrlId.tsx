import { useState } from "react";
import { LinksFunction } from "remix";
import { Outlet, useParams, useNavigate } from "@remix-run/react";
import styled from "styled-components";

import {
  CellFromClientCache,
  createNewCell as createNewCellInClientCache,
  deleteComic as removeComicAndCellsFromClientCache,
} from "~/utils/clientCache";
import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";
import { MAX_DIRTY_CELLS, SCHEMA_VERSION } from "~/utils/constants";
import { isDraftId, removeSuffix } from "~/utils/draftId";

import Cell, { links as cellStylesUrl } from "~/components/Cell";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";
import AddCellModal, {
  links as addCellModalStylesUrl,
} from "~/components/AddCellModal";
import CellActionsModal, {
  links as cellActionsModalStylesUrl,
} from "~/components/CellActionsModal";
import ComicActionsModal, {
  links as comicActionsModalStylesUrl,
} from "~/components/ComicActionsModal";
import PublishPreviewModal, {
  links as publishPreviewModalStylesUrl,
} from "~/components/PublishPreviewModal";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import ReachedDirtyCellLimitModal, {
  links as reachedDirtyCellLimitModalStylesUrl,
} from "~/components/ReachedDirtyCellLimitModal";

import useHydrateComic from "~/hooks/useHydrateComic";

import { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...unstyledLinkStylesUrl(),
    ...addCellModalStylesUrl(),
    ...cellActionsModalStylesUrl(),
    ...comicActionsModalStylesUrl(),
    ...publishPreviewModalStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    ...reachedDirtyCellLimitModalStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const SIDE_BUTTONS_SPACER = 0; //.4
const cellWidth = `${(1 - SIDE_BUTTONS_SPACER) * theme.layout.width}px`;

/**
 * STYLED COMPONENTS
 */
const StudioCell = styled(Cell)<{ cellWidth: string }>`
  margin: 0 auto;
  width: ${(props) => props.cellWidth};
`;

const PinkLabel = styled.div`
  z-index: 999;
  position: absolute;
  font-size: 0.9rem;
  opacity: 0.35;
  padding: 0.1rem 0.2rem;
  background-color: ${(props) => props.theme.colors.pink};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
`;

const UnpublishedChangesLabel = () => (
  <PinkLabel>Unpublished Changes</PinkLabel>
);

/**
 * MAIN
 */
export default function ComicStudioRoute() {
  const navigate = useNavigate();
  const params = useParams();

  const [activeCell, setActiveCell] = useState<CellFromClientCache | null>(
    null
  );
  const [showComicActionsModal, setShowComicActionsModal] = useState(false);
  const [showAddCellModal, setShowAddCellModal] = useState(false);
  const [showCellAddLimitReachedModal, setShowCellAddLimitReachedModal] =
    useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const comicUrlId = params.comicUrlId!;

  const { comic, isHydrating: isHydratingComic } = useHydrateComic({
    comicUrlId,
    onError: () => {
      navigate(DDI_APP_PAGES.gallery(), { replace: true });
    },
  });

  const getCellsFromState = () => {
    const comicsCells = comic?.cells;

    return comicsCells
      ? sortCellsV4(Object.values(comicsCells), comic.initialCellUrlId)
      : [];
  };

  const canAddMoreCells = () => {
    const sortedCells = getCellsFromState();
    const dirtyCells = sortedCells.filter(({ isDirty }) => isDirty);
    return dirtyCells.length < MAX_DIRTY_CELLS;
  };

  const isComicDirty = () => {
    const sortedCells = getCellsFromState();
    const dirtyCells = sortedCells.filter(({ isDirty }) => isDirty);
    return dirtyCells.length > 0;
  };

  const getExitNavLink = () => {
    // this.props.showSpinner()
    if (isDraftId(comicUrlId)) {
      // if (this.props.searchParams) {
      //   window.location = DDI_APP_PAGES.getGalleryPageUrl({
      //     queryString: this.props.searchParams,
      //   })
      // } else {
      const withoutSuffix = removeSuffix(comicUrlId);
      return DDI_APP_PAGES.comic(withoutSuffix);
      // Router.pushRoute(`/comic/${withoutSuffix}`);
      // }
    } else {
      // Router.pushRoute(`/comic/${this.props.comicUrlId}`)
      return DDI_APP_PAGES.comic(comicUrlId);
    }
  };

  const navigateToCellStudio = (studioState?: StudioState | null) => {
    const newCell = createNewCellInClientCache({
      comicUrlId,
      initialStudioState: studioState,
    });

    location.assign(DDI_APP_PAGES.cellStudio(newCell.urlId));
  };

  const navigateToAddCellFromDuplicate = () => {
    navigate(
      DDI_APP_PAGES.comicStudioCopyFromComicCell(comicUrlId, comicUrlId)
    );
    setShowAddCellModal(false);
  };

  const navigateToComicStudioGallery = () => {
    navigate(DDI_APP_PAGES.comicStudioCopyFromComic(comicUrlId));
    setShowAddCellModal(false);
  };

  const handleCellClick = (activeCell: CellFromClientCache) => {
    // if this cell is pristine but we've reached the limit of dirty cells
    // don't allow edits to this cell
    if (!activeCell.isDirty && !canAddMoreCells()) {
      setShowCellAddLimitReachedModal(true);
    } else {
      setActiveCell(activeCell);
    }
  };

  const handleDeleteComicClick = async () => {
    // this.props.showSpinner()
    setShowComicActionsModal(false);

    try {
      if (!isDraftId(comicUrlId)) {
        await fetch(DDI_API_ENDPOINTS.deleteComic(comicUrlId), {
          method: "DELETE",
        });

        // TODO: remove this comic from the gallery cache (when there is a gallery cache in v2)
        // this.props.deleteComicFromCache(
        //   this.props.comicUrlId,
        //   () =>
        //     (window.location = DDI_APP_PAGES.getGalleryPageUrl({
        //       queryString: this.props.searchParams,
        //     }))
        // )
      }

      removeComicAndCellsFromClientCache(comicUrlId);
      navigate(DDI_APP_PAGES.gallery(), { replace: true });
    } catch (error) {
      // this.props.hideSpinner()
      // @todo log error
      console.error(error);
      return;
    }
  };

  const onAddCellClick = () => {
    canAddMoreCells()
      ? setShowAddCellModal(true)
      : setShowCellAddLimitReachedModal(true);
  };

  const sortedCells = getCellsFromState();

  return (
    <>
      <div className="outer-container">
        {isHydratingComic ? (
          <CellWithLoadSpinner />
        ) : (
          <>
            {sortedCells.map((cell) => (
              <div key={cell.imageUrl} onClick={() => handleCellClick(cell)}>
                {cell.isDirty && <UnpublishedChangesLabel />}
                <StudioCell
                  clickable
                  imageUrl={cell.imageUrl || ""}
                  isImageUrlAbsolute={cell.hasNewImage || false}
                  schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
                  caption={cell.studioState?.caption || ""}
                  cellWidth={cellWidth}
                />
              </div>
            ))}
            <MenuButton
              accented={true}
              className="add-cell-button"
              onClick={() => onAddCellClick()}
            >
              +
            </MenuButton>
          </>
        )}
      </div>

      {showAddCellModal && (
        <AddCellModal
          onCancelClick={() => setShowAddCellModal(false)}
          onAddCellFromNewClick={() => navigateToCellStudio()}
          onAddCellFromDuplicate={navigateToAddCellFromDuplicate}
          onAddCellFromAnotherComic={navigateToComicStudioGallery}
          cells={sortedCells}
        />
      )}

      {showComicActionsModal && (
        <ComicActionsModal
          isComicDirty={isComicDirty()}
          onAddCellClick={() => {
            setShowComicActionsModal(false);
            onAddCellClick();
          }}
          onCancelClick={() => setShowComicActionsModal(false)}
          onDeleteClick={() => handleDeleteComicClick()}
          onPublishClick={() => {
            setShowComicActionsModal(false);
            setShowPreviewModal(true);
          }}
        />
      )}

      {activeCell && (
        <CellActionsModal
          cell={activeCell}
          onCancelClick={() => setActiveCell(null)}
          onDuplicateClick={() => navigateToCellStudio(activeCell.studioState)}
        />
      )}

      {showPreviewModal && comic?.initialCellUrlId && (
        <PublishPreviewModal
          cells={sortedCells}
          comicUrlId={comicUrlId}
          initialCellUrlId={comic.initialCellUrlId}
          onCancelClick={() => setShowPreviewModal(false)}
        />
      )}

      {showCellAddLimitReachedModal && (
        <ReachedDirtyCellLimitModal
          onCancelClick={() => setShowCellAddLimitReachedModal(false)}
          onPublishClick={() => {
            setShowCellAddLimitReachedModal(false);
            setShowPreviewModal(true);
          }}
        />
      )}

      <UnstyledLink href={getExitNavLink()}>
        <div className="nav-button bottom-left larger-font">🔙</div>
      </UnstyledLink>

      {!isHydratingComic && (
        <div className="nav-button bottom-right accented larger-font">
          <button onClick={() => setShowComicActionsModal(true)}>⚙️</button>
        </div>
      )}

      <Outlet />
    </>
  );
}

export const unstable_shouldReload = () => false;
