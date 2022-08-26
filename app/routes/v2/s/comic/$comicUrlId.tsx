import { useEffect, useState } from "react";
import { LinksFunction } from "remix";
import { useParams, useNavigate } from "@remix-run/react";
import styled from "styled-components";

import { StudioState } from "~/interfaces/studioState";

import {
  // createComicFromPublishedComic,
  CellFromClientCache,
  createNewCell,
  doesComicUrlIdExist,
  hydrateComicFromClientCache,
  HydratedComic,
} from "~/utils/clientCache";
import { DDI_APP_PAGES } from "~/utils/urls";
import { generateCellImage } from "~/utils/generateCellImageFromEmojis";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";
import { MAX_DIRTY_CELLS, SCHEMA_VERSION } from "~/utils/constants";
import { isDraftId, removeSuffix } from "~/utils/draftId";

import Cell from "~/components/Cell";
import { PinkMenuButton } from "~/components/Button";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";
import AddCellModal from "~/components/AddCellModal";
import CellActionsModal from "~/components/CellActionsModal";

import { get as getComicFromNetwork } from "~/data/external/comics";

export const links: LinksFunction = () => {
  return [...unstyledLinkStylesUrl()];
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
 * UTILS
 */
const hydrateComicFromNetwork = async (
  comicUrlId: string
): Promise<HydratedComic | null> => {
  const comicFromNetwork = await getComicFromNetwork(comicUrlId);

  if (!comicFromNetwork) {
    console.error(`Comic not found. comicUrlId:${comicUrlId}`);
    return null;
  } else if (!comicFromNetwork.userCanEdit) {
    console.error(
      `User is not authorized to edit comic. comicUrlId:${comicUrlId}`
    );
    return null;
  } else if (!comicFromNetwork.isActive) {
    console.error(
      `Comic cannot be edited as it is not active. comicUrlId:${comicUrlId}`
    );
    return null;
  }

  return {
    ...comicFromNetwork,
    cells: comicFromNetwork.cells.reduce((acc, cell) => {
      if (cell.urlId) {
        acc[cell.urlId] = {
          ...cell,
          comicUrlId,
        };
      }
      return acc;
    }, {} as Record<string, CellFromClientCache>),
  };

  // return createComicFromPublishedComic(comicFromNetwork);
  // return comicFromNetwork as HydratedComic;
};

const hydrateComic = async (
  comicUrlId: string
): Promise<HydratedComic | null> => {
  let hydratedComic: HydratedComic | null = null;

  // try to fetch from client cache
  // if exists in client cache
  if (doesComicUrlIdExist(comicUrlId)) {
    console.log(`doesComicUrlIdExist:${comicUrlId}->true`);
    // hydrate the cells and comic from client cache and return formatted data
    hydratedComic = hydrateComicFromClientCache(comicUrlId);
  } else {
    console.log(`doesComicUrlIdExist:${comicUrlId}->false`);
    hydratedComic = await hydrateComicFromNetwork(comicUrlId);
  }

  console.log("hydratedComic", hydratedComic);

  if (!hydratedComic) {
    return null;
    // throw new Error(
    //   `Was not able to hydrate comic for comicUrlId:${comicUrlId}`
    // );
  }

  // hydratedComic = _hydratedComic;

  // generate images for any unpublished cell
  const cells = Object.values(hydratedComic.cells || {});
  const cellsWithUnpublishedImages = cells.filter((cell) => cell.hasNewImage);
  await Promise.all(
    cellsWithUnpublishedImages.map((cellFromClientCache) =>
      generateCellImage(cellFromClientCache)
    )
  );

  return hydratedComic;
};

/**
 * MAIN
 */
export default function ComicStudioRoute() {
  const navigate = useNavigate();
  const params = useParams();

  const [activeCell, setActiveCell] = useState<CellFromClientCache | null>(
    null
  );
  const [comic, setComic] = useState<HydratedComic | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showAddCellModal, setShowAddCellModal] = useState(false);
  const [showCellAddLimitReachedModal, setShowCellAddLimitReachedModal] =
    useState(false);

  const comicUrlId = params.comicUrlId!;

  useEffect(() => {
    const redirectToGallery = () => {
      navigate(DDI_APP_PAGES.getGalleryPageUrl(), { replace: true });
    };

    // redirect to gallery view if url is malformed
    // This is probably handled by remix and therefore unnecessary
    // if (!comicUrlId) {
    //   return redirectToGallery();
    // }

    // let hydratedComic: HydratedComic | null = null;

    hydrateComic(comicUrlId)
      // .then((_hydratedComic) => {
      // console.log("hydratedComic", _hydratedComic);

      // if (!_hydratedComic) {
      //   throw new Error(
      //     `Was not able to hydrate comic for comicUrlId:${comicUrlId}`
      //   );
      // }

      // hydratedComic = _hydratedComic;

      // // generate images for any unpublished cell
      // const cells = Object.values(hydratedComic.cells || {});
      // const cellsWithUnpublishedImages = cells.filter(
      //   (cell) => cell.hasNewImage
      // );
      // return Promise.all(
      //   cellsWithUnpublishedImages.map((cellFromClientCache) =>
      //     generateCellImage(cellFromClientCache)
      //   )
      // );
      // })
      .then((hydratedComic) => {
        if (!hydratedComic) {
          // this.props.showSpinner()
          // return navigate(DDI_APP_PAGES.getCreateNewCellPageUrl(), {
          //   replace: true,
          // });
          return location.replace(DDI_APP_PAGES.getCreateNewCellPageUrl());
        }
        setComic(hydratedComic); /*, () => {
          // hide spinner and scroll to bottom of comic
          this.props.hideSpinner(() =>
            window.scrollTo(0, document.body.scrollHeight)
          );
        });*/
      })
      .catch((error) => {
        // TODO - improve logging
        console.error(error);
        return redirectToGallery();
      });
  }, [comicUrlId]);

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

  const getExitNavLink = () => {
    // this.props.showSpinner()
    if (isDraftId(comicUrlId)) {
      // if (this.props.searchParams) {
      //   window.location = DDI_APP_PAGES.getGalleryPageUrl({
      //     queryString: this.props.searchParams,
      //   })
      // } else {
      const withoutSuffix = removeSuffix(comicUrlId);
      return DDI_APP_PAGES.getComicPageUrl(withoutSuffix);
      // Router.pushRoute(`/comic/${withoutSuffix}`);
      // }
    } else {
      // Router.pushRoute(`/comic/${this.props.comicUrlId}`)
      return DDI_APP_PAGES.getComicPageUrl(comicUrlId);
    }
  };

  const navigateToAddCellFromNew = () => {
    // const { comicUrlId } = this.props

    // const { createNewCell } = require('../../../helpers/clientCache')
    const newCell = createNewCell({ comicUrlId });

    // this.props.showSpinner()
    // this.hideAddCellModal()
    // Router.pushRoute(`/s/cell/${cellId}`)
    location.replace(DDI_APP_PAGES.getCreateNewCellPageUrl(newCell.urlId));
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
    location.replace(DDI_APP_PAGES.getCreateNewCellPageUrl(newCell.urlId));
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
          cells={sortedCells}
        />
      )}

      {/* {this.state.showComicActionsModal && (
            <ComicActionsModal
              isComicDirty={this.isComicDirty()}
              onCancelClick={() => this.toggleComicActionsModal(false)}
              onDeleteClick={() => this.handleDeleteComicClick()}
              onPublishClick={() =>
                this.handlePublishPreviewClick(() =>
                  this.toggleComicActionsModal(false)
                )
              }
            />
          )} */}

      {activeCell && (
        <CellActionsModal
          cell={activeCell}
          onCancelClick={() => setActiveCell(null)}
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
    </>
  );
}
