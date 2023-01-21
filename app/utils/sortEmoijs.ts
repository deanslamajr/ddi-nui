import { EmojiConfigSerialized } from "~/models/emojiConfig";

const sortEmojis = (
  emojiConfigs: EmojiConfigSerialized[],
  isDescending?: boolean
) => {
  emojiConfigs.sort((a, b) => {
    if (a.order < b.order) {
      return isDescending ? 1 : -1;
    }
    return isDescending ? -1 : 1;
  });
  return emojiConfigs;
};

export default sortEmojis;
