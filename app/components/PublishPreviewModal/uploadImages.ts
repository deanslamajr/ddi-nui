import { generateCellImage } from "~/utils/generateCellImageFromEmojis";
import { CellFromClientCache } from "~/utils/clientCache/cell";
import { CAPTCHA_ACTIONS } from "~/utils/constants";

import uploadImage from "~/data/external/uploadImage";
import getSignedRequest from "~/data/external/signCells";

import { SignedCells } from "~/interfaces/signedCells";

import { State as CaptchaV3ContextState } from "~/contexts/CaptchaV3";

const uploadImages = async ({
  captchaV3ContextState,
  cells,
  cellUrlIdsThatRequireImageUploads,
  comicUrlId,
  markTaskCompleted,
  onFail,
  v2CaptchaToken,
}: {
  captchaV3ContextState: CaptchaV3ContextState;
  cells: CellFromClientCache[];
  cellUrlIdsThatRequireImageUploads: string[];
  comicUrlId: string;
  markTaskCompleted: () => void;
  onFail: (isCaptchaFail: boolean) => void;
  v2CaptchaToken?: string;
}): Promise<{
  comicUrlId: string;
  signedCells: SignedCells;
} | void> => {
  let v3CaptchaToken: string | undefined;

  if (!v2CaptchaToken && captchaV3ContextState.isCaptchaV3Enabled) {
    if (!captchaV3ContextState.captchaV3Instance) {
      throw new Error(
        "captcha V3 is enabled for this environment but the captcha V3 library was never able to initialize."
      );
    }

    v3CaptchaToken = await captchaV3ContextState.captchaV3Instance.execute(
      CAPTCHA_ACTIONS.CELL_PUBLISH
    );
  }

  const response = await getSignedRequest({
    cellUrlIdsThatRequireImageUploads,
    comicUrlId,
    v2CaptchaToken,
    v3CaptchaToken,
  });

  if ("didCaptchaFail" in response) {
    onFail(true);
    return;
  }

  const { comicUrlId: comicUrlIdFromSignedRequest, signedCells } = response;

  markTaskCompleted();

  await Promise.all(
    signedCells.map(async ({ draftUrlId, filename, signData }) => {
      const cellDraft = cells.find((cell) => cell.urlId === draftUrlId);

      if (!cellDraft) {
        throw new Error(
          `A cell draft with cellUrlId:${draftUrlId} was not found in state!`
        );
      }

      const { file } = await generateCellImage(cellDraft, filename);

      await uploadImage(file, signData.signedRequest);

      markTaskCompleted();
    })
  );

  return { comicUrlId: comicUrlIdFromSignedRequest, signedCells };
};

export default uploadImages;
