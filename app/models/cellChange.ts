import shortid from "shortid";

import { StudioState } from "~/interfaces/studioState";
import { CellFromClientCache } from "~/utils/clientCache/cell";

/*******************
 ***********
 * TYPES
 */

export type CellChange = {
  id: string;
  studioState: StudioState;
  prevChangeId: string | null;
  nextChangeId: string[];
};

export type CellChangeHistory = {
  currentChangeId: string;
  changes: Record<string, CellChange>;
};

/*******************
 ***********
 * SELECTORS
 */
export const getNewCellChange = ({
  prevChangeId,
  studioStateResultingFromChange,
}: {
  prevChangeId?: string;
  studioStateResultingFromChange: StudioState;
}): CellChange => {
  return {
    id: shortid.generate(),
    studioState: studioStateResultingFromChange,
    prevChangeId: prevChangeId || null,
    nextChangeId: [],
  };
};

/*******************
 ***********
 * CRUD
 */

export const addNewCellChangeToHistory = (
  cellState: CellFromClientCache,
  studioStateResultingFromChange?: StudioState
): void => {
  if (!cellState.changeHistory) {
    const newCellChangeHistory = initializeCellChangeHistory(
      studioStateResultingFromChange || cellState.studioState!
    );
    cellState.changeHistory = newCellChangeHistory;
    return;
  }

  const prevChangeId = cellState.changeHistory.currentChangeId;

  const newCellChange = getNewCellChange({
    prevChangeId,
    studioStateResultingFromChange:
      studioStateResultingFromChange || cellState.studioState!,
  });

  // add new change to history
  cellState.changeHistory.currentChangeId = newCellChange.id;
  cellState.changeHistory.changes[newCellChange.id] = newCellChange;

  // add new change reference to previous change
  const prevChange = cellState.changeHistory.changes[prevChangeId];

  if (prevChange) {
    prevChange.nextChangeId.unshift(newCellChange.id);
  }
};

export const initializeCellChangeHistory = (
  initialStudioState: StudioState
): CellChangeHistory => {
  const newCellChange = getNewCellChange({
    studioStateResultingFromChange: initialStudioState,
  });
  return {
    currentChangeId: newCellChange.id,
    changes: {
      [newCellChange.id]: newCellChange,
    },
  };
};
