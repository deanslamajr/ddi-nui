import shortid from "shortid";
import {
  ChangeDetail,
  ComicStudioStateAction,
  ComicStudioState,
} from "../types";

const createChangeDetail = ({
  previousChangeDetailId,
  update,
}: {
  previousChangeDetailId: string | null;
  update: ComicStudioStateAction;
}): ChangeDetail => {
  return {
    id: shortid.generate(),
    previousChangeDetailId,
    nextChangeDetailId: null,
    action: update,
  };
};

const addNewChangeToHistory = (
  clonedState: ComicStudioState,
  newUpdateDetail: ComicStudioStateAction
): void => {
  const clonedChangeHistory = clonedState.changeHistory;
  const prevHeadId = clonedChangeHistory.headDetailId;

  const newChangeDetail = createChangeDetail({
    previousChangeDetailId: prevHeadId,
    update: newUpdateDetail,
  });

  if (prevHeadId) {
    const prevHeadDetail = clonedChangeHistory.changeDetails[prevHeadId];
    prevHeadDetail.nextChangeDetailId = newChangeDetail.id;
  }

  clonedChangeHistory.changeDetails[newChangeDetail.id] = newChangeDetail;
  clonedChangeHistory.headDetailId = newChangeDetail.id;
};

export default addNewChangeToHistory;
