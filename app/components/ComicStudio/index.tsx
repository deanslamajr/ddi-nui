import { FC, useMemo, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Outlet, useParams, useNavigate } from "@remix-run/react";

import {
  CellFromClientCache,
  createNewCell as createNewCellInClientCache,
} from "~/utils/clientCache/cell";
import { deleteComic as removeComicAndCellsFromClientCache } from "~/utils/clientCache/comic";
import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { MAX_DIRTY_CELLS } from "~/utils/constants";
import { isDraftId } from "~/utils/draftId";
import getClientCookies from "~/utils/getClientCookiesForFetch";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";
import AddCellModal, {
  links as addCellModalStylesUrl,
} from "~/components/AddCellModal";
import ComicActionsModal, {
  links as comicActionsModalStylesUrl,
} from "~/components/ComicActionsModal";
import PublishPreviewModal, {
  links as publishPreviewModalStylesUrl,
} from "~/components/PublishPreviewModal";
import ReachedDirtyCellLimitModal, {
  links as reachedDirtyCellLimitModalStylesUrl,
} from "~/components/ReachedDirtyCellLimitModal";
import CellPreview, { links as studioCellStylesUrl } from "./CellPreview";

import { useComicStudioState } from "~/contexts/ComicStudioState";

import type { StudioState } from "~/interfaces/studioState";

import stylesUrl from "~/styles/components/ComicStudio.css";

export const links: LinksFunction = () => {
  return [
    ...studioCellStylesUrl(),
    ...unstyledLinkStylesUrl(),
    ...addCellModalStylesUrl(),
    ...comicActionsModalStylesUrl(),
    ...publishPreviewModalStylesUrl(),
    ...reachedDirtyCellLimitModalStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

/**
 * MAIN
 */
export const ComicStudio: FC<{}> = ({}) => {
  const navigate = useNavigate();
  const params = useParams();
  const comicUrlId = params.comicUrlId!;
  const isUninitializedComic = comicUrlId === "new";

  const [showComicActionsModal, setShowComicActionsModal] = useState(false);
  const [showAddCellModal, setShowAddCellModal] =
    useState(isUninitializedComic);
  const [showCellAddLimitReachedModal, setShowCellAddLimitReachedModal] =
    useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [comicStudioState] = useComicStudioState();

  const getCellsFromState = () => {
    return Object.values(comicStudioState.comicState.cells || {}) || [];
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
    if (isDraftId(comicUrlId) || comicUrlId === "new") {
      return DDI_APP_PAGES.gallery();
    } else {
      return DDI_APP_PAGES.comic(comicUrlId);
    }
  };

  const navigateToCellStudio = (studioState?: StudioState | null) => {
    const newCell = createNewCellInClientCache({
      comicUrlId: isUninitializedComic ? undefined : comicUrlId,
      initialStudioState: studioState,
    });

    navigate(
      DDI_APP_PAGES.cellStudio({
        comicUrlId: newCell.comicUrlId,
        cellUrlId: newCell.urlId,
      }),
      {
        state: { scroll: false },
      }
    );

    setShowAddCellModal(false);
  };

  const navigateToAddCellFromDuplicate = () => {
    navigate(
      DDI_APP_PAGES.comicStudioCopyFromComicCell(comicUrlId, comicUrlId),
      { state: { scroll: false } }
    );
    setShowAddCellModal(false);
  };

  const navigateToComicStudioGallery = () => {
    navigate(DDI_APP_PAGES.comicStudioCopyFromComic(comicUrlId), {
      state: { scroll: false },
    });
    setShowAddCellModal(false);
  };

  const handleCellClick = (activeCell: CellFromClientCache) => {
    // if this cell is pristine but we've reached the limit of dirty cells
    // don't allow edits to this cell
    if (!activeCell.isDirty && !canAddMoreCells()) {
      setShowCellAddLimitReachedModal(true);
    } else {
      navigate(
        DDI_APP_PAGES.cellStudio({ comicUrlId, cellUrlId: activeCell.urlId }),
        {
          state: { scroll: false },
        }
      );
    }
  };

  const handleDeleteComicClick = async () => {
    // this.props.showSpinner()
    setShowComicActionsModal(false);

    try {
      if (!isDraftId(comicUrlId)) {
        await fetch(DDI_API_ENDPOINTS.deleteComic(comicUrlId), {
          method: "DELETE",
          ...getClientCookies(),
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

  const onCaptionClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    console.log("onCaptionClick is clicked!");
  };

  const renderedComicPreview = useMemo(() => {
    return sortedCells.map((cell) => (
      <CellPreview
        key={cell.urlId}
        cellUrlId={cell.urlId}
        onCellClick={handleCellClick}
        onCaptionClick={onCaptionClick}
      />
    ));
  }, []);

  return (
    <>
      <div className="outer-container">
        <>
          {renderedComicPreview}
          {sortedCells.length > 0 && (
            <MenuButton
              accented={true}
              className="add-cell-button"
              onClick={() => onAddCellClick()}
            >
              +
            </MenuButton>
          )}
        </>
      </div>

      {showAddCellModal && (
        <AddCellModal
          onCancelClick={() =>
            isUninitializedComic
              ? navigate(getExitNavLink())
              : setShowAddCellModal(false)
          }
          onAddCellFromNewClick={() => navigateToCellStudio()}
          onAddCellFromDuplicate={navigateToAddCellFromDuplicate}
          onAddCellFromAnotherComic={navigateToComicStudioGallery}
          cells={sortedCells}
          titleOverride={
            sortedCells.length === 0 ? "Create a New Comic" : undefined
          }
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

      {showPreviewModal && comicStudioState.comicState.initialCellUrlId && (
        <PublishPreviewModal
          cells={sortedCells}
          comicUrlId={comicUrlId}
          initialCellUrlId={comicStudioState.comicState.initialCellUrlId}
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
        <div className="nav-button bottom-left large-icon">🖼️</div>
      </UnstyledLink>

      {sortedCells.length > 0 && (
        <div className="nav-button bottom-right accented large-icon">
          <button onClick={() => setShowComicActionsModal(true)}>⚙️</button>
        </div>
      )}

      <Outlet />
    </>
  );
};
