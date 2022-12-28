import { MoveUpdateDetails } from "./types";

// Action creators
export const moveEmoji = ({
  cellUrlId,
  emojiId,
  xDiff,
  yDiff,
}: {
  cellUrlId: string;
  emojiId: number;
  xDiff: number;
  yDiff: number;
}): MoveUpdateDetails => ({
  type: "MOVE",
  data: {
    cellUrlId,
    emojiId,
    xDiff,
    yDiff,
  },
});
