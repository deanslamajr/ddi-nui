import { useState } from "react";
import { LinksFunction } from "remix";
import { Outlet, useParams, useNavigate } from "@remix-run/react";
import styled from "styled-components";

import {
  CellFromClientCache,
  createNewCell as createNewCellInClientCache,
  deleteComic as removeComicAndCellsFromClientCache,
} from "~/utils/clientCache";
import createUpdatePayload from "~/utils/createUpdatePayload";
import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { sortCellsV4 } from "~/utils/sortCells";
import { theme } from "~/utils/stylesTheme";
import { MAX_DIRTY_CELLS, SCHEMA_VERSION } from "~/utils/constants";
import { isDraftId, removeSuffix } from "~/utils/draftId";
import { generateCellImage } from "~/utils/generateCellImageFromEmojis";

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
import PublishPreviewModal from "~/components/PublishPreviewModal";

import useHydrateComic from "~/hooks/useHydrateComic";

import { SignedCells } from "~/interfaces/signedCells";

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

function uploadImage(imageFile: File, signedRequest: string) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve();
        } else {
          // @todo better UX
          console.error("could not upload file!");
          reject();
        }
      }
    };
    xhr.send(imageFile);
  });
}

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
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const comicUrlId = params.comicUrlId!;

  const comic = useHydrateComic({
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
    const newCell = createNewCellInClientCache({ comicUrlId });

    setShowAddCellModal(false);

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

      removeComicAndCellsFromClientCache(comicUrlId);
      navigate(DDI_APP_PAGES.gallery(), { replace: true });
    } catch (error) {
      // this.props.hideSpinner()
      // @todo log error
      console.error(error);
      return;
    }
  };

  const getCellsWithNewImage = () => {
    const cells = Object.values(comic?.cells || {});
    return cells.filter(({ hasNewImage }) => hasNewImage);
  };

  const getSignedRequest = async (captchaTokens: {
    v2?: string;
    v3?: string;
  }): Promise<{
    comicUrlId: string;
    signedCells: SignedCells;
  }> => {
    const cellIdsToSign = getCellsWithNewImage().map(({ urlId }) => urlId);

    const signData: {
      newCells: string[]; // strings are draftIds e.g. 'draft--someId', 'draft--anotherId'
      v2Token?: string;
      v3Token?: string;
    } = { newCells: cellIdsToSign };

    if (captchaTokens.v2) {
      signData.v2Token = captchaTokens.v2;
    } else if (captchaTokens.v3) {
      signData.v3Token = captchaTokens.v3;
    }

    console.log("signData", signData);

    const response: Response = await fetch(
      DDI_API_ENDPOINTS.signComicCells(comicUrlId),
      {
        method: "POST",
        body: JSON.stringify(signData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Sign comic cells request failed.");
    }

    const data = await response.json();

    console.log("data", data);

    return {
      comicUrlId: data.comicUrlId,
      signedCells: data.cells,
    };
  };

  const upload = async (
    v2CaptchaToken?: string
  ): Promise<{
    comicUrlId: string;
    signedCells: SignedCells;
  } | void> => {
    let token;

    try {
      // if (!v2CaptchaToken && publicRuntimeConfig.CAPTCHA_V3_SITE_KEY) {
      //   token = await this.props.recaptcha.execute(CAPTCHA_ACTION_CELL_PUBLISH)
      // }

      const { signedCells, comicUrlId: comicUrlIdFromSignedRequest } =
        await getSignedRequest({
          v2: v2CaptchaToken,
          v3: token,
        });

      // this.props.markJobAsFinished();

      await Promise.all(
        signedCells.map(async ({ draftUrlId, filename, signData }) => {
          if (!comic) {
            throw new Error('"comic" does not exist in component state!');
          }

          if (!comic.cells) {
            throw new Error('"comic.cells" does not exist in component state!');
          }

          const cell = comic.cells[draftUrlId];

          if (!cell) {
            throw new Error(`signed cell ${draftUrlId} not found in state!`);
          }

          const file = await generateCellImage(cell, filename);

          await uploadImage(file, signData.signedRequest);

          // this.props.markJobAsFinished()
        })
      );

      return { comicUrlId: comicUrlIdFromSignedRequest, signedCells };
    } catch (e) {
      console.error(e);
      // const isCaptchaFail = e && e.response && e.response.status === 400;
      // @todo log this

      // this.props.hideSpinner();
      // this.togglePreviewModal(false);
      // this.togglePublishFailModal(true, isCaptchaFail);
    }
  };

  const publishComicUpdate = async ({
    comicUrlIdToUpdate,
    signedCells,
  }: {
    comicUrlIdToUpdate: string;
    signedCells?: SignedCells;
  }): Promise<void> => {
    if (!comic) {
      throw new Error(
        "publishComicUpdate expects a comic to exist in component state by now but this does not seem to be the case here!"
      );
    }

    const updatePayload = await createUpdatePayload({
      comic,
      comicUrlIdToUpdate,
      isPublishedComic: !isDraftId(comicUrlId),
      signedCells,
    });

    await fetch(DDI_API_ENDPOINTS.updateComic(comicUrlIdToUpdate), {
      method: "PATCH",
      body: JSON.stringify(updatePayload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // await axios.patch(`/api/comic/${comicUrlIdToUpdate}`, updatePayload);
  };

  const publish = async (v2CaptchaToken?: string) => {
    let signedCells: SignedCells | undefined;
    // If the comic had a draftId at signing
    // this would be a new, non-draft comicUrlId
    let possiblyNewComicUrlId: string | undefined;
    // minimum number of "jobs" required to finish a publish
    // i.e. all jobs excluding uploads
    let totalJobsCount = 1;

    const cellsThatRequireUploads = getCellsWithNewImage();

    try {
      if (cellsThatRequireUploads.length) {
        // if image uploading is required:
        // 1 + # of cells that require uploads
        totalJobsCount += 1 + cellsThatRequireUploads.length;

        // this.props.showSpinner(totalJobsCount)

        const uploadResponse = await upload(v2CaptchaToken);

        // fail case, do not continue
        if (!uploadResponse) {
          return;
        }

        signedCells = uploadResponse.signedCells;
        possiblyNewComicUrlId = uploadResponse.comicUrlId;
      } else {
        // this.props.showSpinner(totalJobsCount);
        possiblyNewComicUrlId = comicUrlId;
      }

      await publishComicUpdate({
        comicUrlIdToUpdate: possiblyNewComicUrlId,
        signedCells,
      });

      // this.props.markJobAsFinished();

      //delete comic from client cache
      removeComicAndCellsFromClientCache(comicUrlId);

      // Router.pushRoute(`/comic/${possiblyNewComicUrlId}`);
      location.assign(DDI_APP_PAGES.comic(possiblyNewComicUrlId));
    } catch (e) {
      console.error(e);
      // @todo log this

      // this.props.hideSpinner();
      setShowPreviewModal(false);
      // this.togglePublishFailModal(true);
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
          onPublishClick={() => {
            setShowPreviewModal(true);
          }}
        />
      )}

      {activeCell && (
        <CellActionsModal
          cell={activeCell}
          onCancelClick={() => setActiveCell(null)}
          onDuplicateClick={navigateToAddCellFromDuplicate}
        />
      )}

      {showPreviewModal && (
        <PublishPreviewModal
          onCancelClick={() => setShowPreviewModal(false)}
          onPublishClick={() => publish()}
          cells={sortedCells}
        />
      )}

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
