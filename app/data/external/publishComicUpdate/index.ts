import { CellFromClientCache } from "~/utils/clientCache";
import { DDI_API_ENDPOINTS } from "~/utils/urls";

import { SignedCells } from "~/interfaces/signedCells";

import createUpdatePayload from "./createUpdatePayload";

const publishComicUpdate = async ({
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
}): Promise<void> => {
  const updatePayload = await createUpdatePayload({
    cells,
    comicUrlIdToUpdate,
    initialCellUrlId,
    isPublishedComic,
    signedCells,
  });

  const response = await fetch(
    DDI_API_ENDPOINTS.updateComic(comicUrlIdToUpdate),
    {
      method: "PATCH",
      body: JSON.stringify(updatePayload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw response;
  }
};

export default publishComicUpdate;
