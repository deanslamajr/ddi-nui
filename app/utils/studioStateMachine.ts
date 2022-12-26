import shortid from "shortid";
import cloneDeep from "fast-clone";

import { EmojiConfigSerialized, StudioState } from "~/interfaces/studioState";

export const MOVE_EMOJI = "MOVE_EMOJI";

type CommonUpdateDetails = {
  type: typeof MOVE_EMOJI;
  emoijId: number;
};

type UpdateDetailsFromType = {
  data: Pick<EmojiConfigSerialized, "x" | "y">;
};

type UpdateDetails = CommonUpdateDetails & UpdateDetailsFromType;

let studioState: StudioState;

const cloneStudioState = (): StudioState => {
  return cloneDeep(studioState);
};

type StudioStateUpdateAlg = (updateDetails: UpdateDetails) => StudioState;

const moveEmoji: StudioStateUpdateAlg = (update) => {
  const newStudioState = cloneStudioState();
  const emojis = newStudioState.emojis;
  const activeEmojiId = update.emoijId;
  const activeEmoji = emojis[activeEmojiId];

  emojis[activeEmojiId].x = activeEmoji.x + update.data.x;
  emojis[activeEmojiId].y = activeEmoji.y + update.data.y;

  return newStudioState;
};

export const init = (initState: StudioState): void => {
  studioState = initState;
};

export const update = (updateDetails: UpdateDetails): StudioState => {
  switch (updateDetails.type) {
    case MOVE_EMOJI: {
      studioState = moveEmoji(updateDetails);
    }
  }

  return studioState;
};
