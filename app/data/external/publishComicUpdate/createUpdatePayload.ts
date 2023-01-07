import type { CellFromClientCache } from "~/utils/clientCache/cell";
import type { HydratedComic } from "~/utils/clientCache/comic";
import { isDraftId } from "~/utils/draftId";
import { SCHEMA_VERSION } from "~/utils/constants";

import { hydrateFromNetwork } from "~/data/client/comic";

import { SignedCells } from "~/interfaces/signedCells";
import { StudioState } from "~/interfaces/studioState";

type CellForApiUpdate = {
  caption?: string;
  order?: null;
  previousCellUrlId?: string | null;
  schemaVersion?: typeof SCHEMA_VERSION;
  studioState?: StudioState;
  updateImageUrl?: boolean;
  urlId: string;
};

function transformCellFromClientStateForApiUpdate(
  cellFromState: CellFromClientCache,
  signedCells?: SignedCells,
  publishedComic?: HydratedComic
) {
  const transformedCell: CellForApiUpdate = {
    urlId: getUrlId(cellFromState, signedCells),
  };

  const caption = getCaption(cellFromState, publishedComic);
  if (typeof caption === "string") {
    transformedCell.caption = caption;
  }

  if (!isDraftId(cellFromState.urlId)) {
    if (!publishedComic) {
      throw new Error(
        `Cell from client state with nonDraftUrlId:${cellFromState.urlId} is expected to be associated with a published comic but the associated comic with comicUrlId:${cellFromState.comicUrlId} does not seem to return data from api!`
      );
    }

    if (!publishedComic.cells) {
      throw new Error(
        `Published comic with comicUrlId:${publishedComic.urlId} does not seem to have any associated cells!`
      );
    }

    const publishedCell = getPublishedCell(
      cellFromState.urlId,
      publishedComic.cells
    );

    // for schemaVersion < 4
    // set order to null
    if (!publishedCell.schemaVersion || publishedCell.schemaVersion < 4) {
      transformedCell.order = null;
    }

    // set schemaVersion to current schemaVersion
    if (publishedCell.schemaVersion !== SCHEMA_VERSION) {
      transformedCell.schemaVersion = SCHEMA_VERSION;
    }
  }

  const previousCellUrlId = getPreviousCellUrlId(
    cellFromState,
    signedCells,
    publishedComic
  );

  if (previousCellUrlId === null || previousCellUrlId) {
    transformedCell.previousCellUrlId = previousCellUrlId;
  }

  const studioState = getStudioState(cellFromState, publishedComic);
  if (studioState) {
    transformedCell.studioState = studioState;
  }

  // update the image of a published cell
  if (cellFromState.hasNewImage && !isDraftId(cellFromState.urlId)) {
    transformedCell.updateImageUrl = true;
  }

  return transformedCell;
}

function getStudioState(
  cellFromState: CellFromClientCache,
  publishedComic?: HydratedComic
) {
  const studioState = cellFromState.studioState;

  if (isDraftId(cellFromState.urlId)) {
    return studioState;
  }

  if (!publishedComic) {
    throw new Error(
      `Cell from client state with nonDraftUrlId:${cellFromState.urlId} is expected to be associated with a published comic but the associated comic with comicUrlId:${cellFromState.comicUrlId} does not seem to return data from api!`
    );
  }

  const publishedStudioState = getPublishedCell(
    cellFromState.urlId,
    publishedComic.cells
  ).studioState;

  if (JSON.stringify(studioState) === JSON.stringify(publishedStudioState)) {
    return;
  }

  return studioState;
}

function getPreviousCellUrlId(
  cellFromState: CellFromClientCache,
  signedCells?: SignedCells,
  publishedComic?: HydratedComic
) {
  if (
    isDraftId(cellFromState.urlId) &&
    cellFromState.previousCellUrlId === null
  ) {
    return null;
  } else if (isDraftId(cellFromState.previousCellUrlId)) {
    if (!signedCells) {
      throw new Error(
        "Signed cells data expected when cells with draft id`s are present."
      );
    }
    return getSignedCell(cellFromState.previousCellUrlId!, signedCells).urlId;
  } else {
    const previousCellUrlId = cellFromState.previousCellUrlId;

    // For cell updates to previously published cells:
    // Include "previousCellUrlId" only if there was a change from the previously published value
    if (!isDraftId(cellFromState.urlId)) {
      if (!publishedComic) {
        throw new Error(
          `Cell from client state with nonDraftUrlId:${cellFromState.urlId} is expected to be associated with a published comic but the associated comic with comicUrlId:${cellFromState.comicUrlId} does not seem to return data from api!`
        );
      }

      if (!publishedComic.cells) {
        throw new Error(
          `Published comic with comicUrlId:${publishedComic.urlId} does not seem to have any associated cells!`
        );
      }

      const publishedPreviousCellUrlId = getPublishedCell(
        cellFromState.urlId,
        publishedComic.cells
      ).previousCellUrlId;

      if (previousCellUrlId === publishedPreviousCellUrlId) {
        return;
      }
    }

    return previousCellUrlId;
  }
}

function getCaption(
  cellFromState: CellFromClientCache,
  publishedComic?: HydratedComic
) {
  const caption = cellFromState.studioState?.caption;

  if (isDraftId(cellFromState.urlId)) {
    return caption || "";
  }

  const publishedCaption = getPublishedCell(
    cellFromState.urlId,
    publishedComic!.cells
  ).studioState?.caption;

  // This should be the only return that represents "no change"
  // The other returns should always return a string (e.g. if undefined, return empty string)
  // as we want caption updates of "cleared out captions" to be represented as a change
  // to the empty string.
  if (caption === publishedCaption) {
    return;
  }

  return caption || "";
}

function getUrlId(
  cellFromState: CellFromClientCache,
  signedCells?: SignedCells
) {
  if (isDraftId(cellFromState.urlId)) {
    if (!signedCells) {
      throw new Error("A cell with draftId requires signedCells data!");
    }

    return getSignedCell(cellFromState.urlId, signedCells).urlId;
  } else {
    return cellFromState.urlId;
  }
}

function getPublishedCell(
  cellUrlId: string,
  publishedCells: HydratedComic["cells"]
) {
  const publishedCell = Object.values(publishedCells || {}).find(
    (publishedCell: CellFromClientCache) => cellUrlId === publishedCell.urlId
  );

  if (!publishedCell) {
    throw new Error(`Published cell does not exist for cellUrlId ${cellUrlId}`);
  }
  return publishedCell;
}

function getSignedCell(cellUrlId: string, signedCells: SignedCells) {
  const signedCell = signedCells.find(
    ({ draftUrlId }) => cellUrlId === draftUrlId
  );
  if (!signedCell) {
    throw new Error(
      `Signed cell does not exist for cellFromState with cellUrlId:${cellUrlId}`
    );
  }
  return signedCell;
}

type UpdatePayload =
  | {
      cells: CellForApiUpdate[];
      initialCellUrlId: string | null;
      type: "NEW";
    }
  | {
      cells: CellForApiUpdate[];
      initialCellUrlId?: string | null;
      type: "UPDATE";
    }
  | undefined;

const createUpdatePayload = async ({
  cells,
  comicUrlIdToUpdate,
  initialCellUrlId,
  isPublishedComic,
  signedCells,
}: {
  cells: CellFromClientCache[];
  comicUrlIdToUpdate: string;
  initialCellUrlId: string;
  isPublishedComic: boolean;
  signedCells?: SignedCells;
}): Promise<UpdatePayload> => {
  let updatePayload: UpdatePayload;

  if (!isPublishedComic) {
    if (!signedCells) {
      throw new Error(
        "An unpublished comic should have a signedCells payload but this one does not."
      );
    }

    const initialCell = getSignedCell(initialCellUrlId, signedCells);
    const transformedCells = Object.values(cells).map((cell) =>
      transformCellFromClientStateForApiUpdate(cell, signedCells)
    );

    updatePayload = {
      cells: transformedCells,
      initialCellUrlId: initialCell.urlId,
      type: "NEW",
    };
  } else {
    const publishedComic = await hydrateFromNetwork(comicUrlIdToUpdate);

    if (!publishedComic) {
      throw new Error(
        `Get comic api did not return a published comic for the given comicUrlId:${comicUrlIdToUpdate}`
      );
    }

    const transformedCells = cells
      .filter(({ isDirty }) => isDirty)
      .map((cell) =>
        transformCellFromClientStateForApiUpdate(
          cell,
          signedCells,
          publishedComic
        )
      );

    updatePayload = {
      cells: transformedCells,
      type: "UPDATE",
    };

    if (initialCellUrlId !== publishedComic.initialCellUrlId) {
      updatePayload.initialCellUrlId = initialCellUrlId;
    }
  }

  return updatePayload;
};

export default createUpdatePayload;
