import type { CellFromClientCache } from "~/utils/clientCache/cell";
import { DDI_API_ENDPOINTS } from "~/utils/urls";
import getClientCookies from "~/utils/getClientCookiesForFetch";

import { SignedCells } from "~/interfaces/signedCells";

import createUpdatePayload from "./createUpdatePayload";

const publishComicUpdate = async ({
  cells,
  comicUrlIdToUpdate,
  initialCellUrlId,
  isPublishedComic,
  markTaskCompleted,
  signedCells,
}: {
  cells: CellFromClientCache[];
  comicUrlIdToUpdate: string;
  initialCellUrlId: string;
  isPublishedComic: boolean;
  markTaskCompleted: () => void;
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
      ...getClientCookies(),
    }
  );

  if (!response.ok) {
    throw response;
  }

  markTaskCompleted();
};

export default publishComicUpdate;
