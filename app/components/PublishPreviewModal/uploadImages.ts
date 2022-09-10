import { generateCellImage } from "~/utils/generateCellImageFromEmojis";
import { CellFromClientCache } from "~/utils/clientCache";

import uploadImage from "~/data/external/uploadImage";
import getSignedRequest from "~/data/external/signCells";

import { SignedCells } from "~/interfaces/signedCells";

const uploadImages = async ({
  cells,
  cellUrlIdsThatRequireImageUploads,
  comicUrlId,
  onFail,
  v2CaptchaToken,
}: {
  cells: CellFromClientCache[];
  cellUrlIdsThatRequireImageUploads: string[];
  comicUrlId: string;
  onFail: (isCaptchaFail: boolean) => void;
  v2CaptchaToken?: string;
}): Promise<{
  comicUrlId: string;
  signedCells: SignedCells;
} | void> => {
  const response = await getSignedRequest({
    cellUrlIdsThatRequireImageUploads,
    comicUrlId,
    v2CaptchaToken: v2CaptchaToken,
  });

  if ("didCaptchaFail" in response) {
    onFail(true);
    return;
  }

  const { comicUrlId: comicUrlIdFromSignedRequest, signedCells } = response;

  // this.props.markJobAsFinished();

  await Promise.all(
    signedCells.map(async ({ draftUrlId, filename, signData }) => {
      const cellDraft = cells.find((cell) => cell.urlId === draftUrlId);

      if (!cellDraft) {
        throw new Error(
          `A cell draft with cellUrlId:${draftUrlId} was not found in state!`
        );
      }

      const file = await generateCellImage(cellDraft, filename);

      await uploadImage(file, signData.signedRequest);

      // this.props.markJobAsFinished()
    })
  );

  return { comicUrlId: comicUrlIdFromSignedRequest, signedCells };
};

export default uploadImages;
