import { DRAFT_SUFFIX } from "~/utils/constants";

export const isDraftId = (comicUrlId: string | null = "") => {
  if (comicUrlId === null) {
    return false;
  }

  return comicUrlId.includes(DRAFT_SUFFIX);
};

export const removeSuffix = (comicUrlId: string) => {
  // if (comicUrlId === null) {
  //   return null
  // }

  if (comicUrlId.includes(DRAFT_SUFFIX)) {
    return comicUrlId.replace(DRAFT_SUFFIX, "");
  }

  return comicUrlId;
};
