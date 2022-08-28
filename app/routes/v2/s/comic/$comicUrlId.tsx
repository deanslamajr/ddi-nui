import { useEffect, useState } from "react";
import { LinksFunction } from "remix";
import { Outlet, useParams, useNavigate } from "@remix-run/react";
import styled from "styled-components";

import { StudioState } from "~/interfaces/studioState";

import {
  // createComicFromPublishedComic,
  CellFromClientCache,
  createNewCell,
  deleteComic,
} from "~/utils/clientCache";
import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";
import { MAX_DIRTY_CELLS, SCHEMA_VERSION } from "~/utils/constants";
import { isDraftId, removeSuffix } from "~/utils/draftId";

import Cell from "~/components/Cell";
import { PinkMenuButton } from "~/components/Button";
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

import useComic from "~/hooks/useComic";

export const links: LinksFunction = () => {
  return [
    ...unstyledLinkStylesUrl(),
    ...addCellModalStylesUrl(),
    ...cellActionsModalStylesUrl(),
    ...comicActionsModalStylesUrl(),
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

const AddCellButton = styled(PinkMenuButton)`
  font-size: 2.5rem;
  width: ${(props) => props.theme.layout.width}px;
`;

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  margin: 1rem auto ${(props) => props.theme.layout.bottomPadding}px;
`;

/**
 * MAIN
 */
export default function ComicStudioRoute() {
  const navigate = useNavigate();
  const params = useParams();

  const [activeCell, setActiveCell] = useState<CellFromClientCache | null>(
    null
  );
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showAddCellModal, setShowAddCellModal] = useState(false);
  const [showCellAddLimitReachedModal, setShowCellAddLimitReachedModal] =
    useState(false);

  const comicUrlId = params.comicUrlId!;

  const comic = useComic({
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

  const navigateToAddCellFromNew = () => {
    // const { comicUrlId } = this.props

    // const { createNewCell } = require('../../../helpers/clientCache')
    const newCell = createNewCell({ comicUrlId });

    // this.props.showSpinner()
    // this.hideAddCellModal()
    // Router.pushRoute(`/s/cell/${cellId}`)
    location.replace(DDI_APP_PAGES.cellStudio(newCell.urlId));
  };

  const navigateToAddCellFromDuplicate = (studioState?: StudioState | null) => {
    // const { comicUrlId } = this.props

    // const { createNewCell } = require('../../../helpers/clientCache')

    const newCell = createNewCell({
      comicUrlId,
      initialStudioState: studioState,
    });

    // this.props.showSpinner()
    // this.hideAddCellModal()
    // Router.pushRoute(`/s/cell/${newCell}`)
    location.replace(DDI_APP_PAGES.cellStudio(newCell.urlId));
  };

  const navigateToComicStudioGallery = () => {
    location.replace(DDI_APP_PAGES.comicStudioCopyFromComic(comicUrlId));
  };

  const handleCellClick = (activeCell: CellFromClientCache) => {
    // if this cell is pristine but we've reached the limit of dirty cells
    // don't allow edits to this cell
    if (!activeCell.isDirty && !canAddMoreCells()) {
      // this.showReachedDirtyCellLimitModal()
    } else {
      setActiveCell(activeCell);
    }
  };

  const handleDeleteComicClick = async () => {
    // this.props.showSpinner()
    setShowActionsModal(false);

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

      deleteComic(comicUrlId);
      navigate(DDI_APP_PAGES.gallery(), { replace: true });
    } catch (error) {
      // this.props.hideSpinner()
      // @todo log error
      console.error(error);
      return;
    }
  };

  const sortedCells = getCellsFromState();

  return (
    <>
      <OuterContainer>
        {/* CELLS */}
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
        <AddCellButton
          onClick={() =>
            canAddMoreCells()
              ? setShowAddCellModal(true)
              : setShowCellAddLimitReachedModal(true)
          }
        >
          +
        </AddCellButton>
      </OuterContainer>

      {showAddCellModal && (
        <AddCellModal
          onCancelClick={() => setShowAddCellModal(false)}
          onAddCellFromNewClick={navigateToAddCellFromNew}
          onAddCellFromDuplicate={navigateToAddCellFromDuplicate}
          onAddCellFromAnotherComic={navigateToComicStudioGallery}
          cells={sortedCells}
        />
      )}

      {showActionsModal && (
        <ComicActionsModal
          isComicDirty={isComicDirty()}
          onCancelClick={() => setShowActionsModal(false)}
          onDeleteClick={() => handleDeleteComicClick()}
          onPublishClick={
            () => {}
            // this.handlePublishPreviewClick(() =>
            //   this.toggleComicActionsModal(false)
            // )
          }
        />
      )}

      {activeCell && (
        <CellActionsModal
          cell={activeCell}
          onCancelClick={() => setActiveCell(null)}
          onDuplicateClick={navigateToAddCellFromDuplicate}
        />
      )}

      {/* {this.state.showPreviewModal && (
            <PublishPreviewModal
              onCancelClick={() => this.togglePreviewModal(false)}
              onPublishClick={() => this.publish()}
              cells={sortedCells}
            />
          )} */}

      {/* {this.state.showReachedDirtyCellLimitModal && (
            <ReachedDirtyCellLimitModal
              onCancelClick={() => this.hideReachedDirtyCellLimitModal()}
              onPublishClick={() =>
                this.handlePublishPreviewClick(() =>
                  this.hideReachedDirtyCellLimitModal()
                )
              }
            />
          )} */}

      {/* {this.state.showPublishFailModal && (
            <PublishFailModal
              hasFailedCaptcha={this.state.hasFailedCaptcha}
              onRetryClick={(token) => this.retryPublish(token)}
              onCancelClick={() => this.cancelPublishAttemp()}
            />
          )} */}

      <UnstyledLink href={getExitNavLink()}>
        <div className="nav-button bottom-left larger-font">🔙</div>
      </UnstyledLink>

      <div className="nav-button bottom-right accented larger-font">
        <button onClick={() => setShowActionsModal(true)}>⚙️</button>
      </div>

      <Outlet />
    </>
  );
}

export const unstable_shouldReload = () => false;
