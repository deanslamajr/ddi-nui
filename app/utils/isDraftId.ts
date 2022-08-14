import { DRAFT_SUFFIX } from "~/utils/constants";

const isDraftId = (comicId: string | null = "") => {
  if (comicId === null) {
    return false;
  }

  return comicId.includes(DRAFT_SUFFIX);
};

export default isDraftId;
