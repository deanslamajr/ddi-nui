import {
  EmojiConfigSerialized,
  EmojiConfigFromGetComic,
  EmojiConfigFromOlderGetComic,
} from "~/models/emojiConfig";

export type AllStudioStateVersions =
  | StudioState
  | StudioStateFromGetComic
  | OlderStudioStateFromGetComic;

type StudioStateBase = {
  activeEmojiId: number;
  currentEmojiId: number;
};

export type StudioState = StudioStateBase & {
  backgroundColor: string;
  caption: string;
  emojis: Record<string, EmojiConfigSerialized>;
};

// This version is returned from GET comic/:comicUrlId
export type StudioStateFromGetComic = StudioStateBase & {
  backgroundColor: string;
  caption: string;
  emojis: Record<string, EmojiConfigFromGetComic>;
};

export type OlderStudioStateFromGetComic = StudioStateBase & {
  showEmojiPicker: boolean;
  title: string;
  emojis: Record<string, EmojiConfigFromOlderGetComic>;
};
