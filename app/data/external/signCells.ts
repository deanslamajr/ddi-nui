import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";

import { SignedCells } from "~/interfaces/signedCells";

const signCells = async ({
  cellUrlIdsThatRequireImageUploads,
  comicUrlId,
  v2CaptchaToken,
}: {
  cellUrlIdsThatRequireImageUploads: string[];
  comicUrlId: string;
  v2CaptchaToken?: string;
}): Promise<
  | {
      comicUrlId: string;
      signedCells: SignedCells;
    }
  | {
      didCaptchaFail: true;
    }
> => {
  let v3CaptchaToken;
  // if (!v2CaptchaToken && publicRuntimeConfig.CAPTCHA_V3_SITE_KEY) {
  //   v3CaptchaToken = await this.props.recaptcha.execute(CAPTCHA_ACTION_CELL_PUBLISH)
  // }

  const signData: {
    newCells: string[]; // strings are draftIds e.g. 'draft--someId', 'draft--anotherId'
    v2Token?: string;
    v3Token?: string;
  } = { newCells: cellUrlIdsThatRequireImageUploads };

  if (v2CaptchaToken) {
    signData.v2Token = v2CaptchaToken;
  } else if (v3CaptchaToken) {
    signData.v3Token = v3CaptchaToken;
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
    if (response.status === 400) {
      return {
        didCaptchaFail: true,
      };
    }
    throw response;
  }

  const data = await response.json();

  console.log("data", data);

  return {
    comicUrlId: data.comicUrlId,
    signedCells: data.cells,
  };
};

export default signCells;
