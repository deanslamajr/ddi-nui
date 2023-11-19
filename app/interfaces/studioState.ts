import {
  EmojiConfigSerialized,
  EmojiConfigFromGetComic,
  EmojiConfigFromOlderGetComic,
} from "~/models/emojiConfig";

export type AllStudioStateVersions =
  | StudioState
  | StudioStateFromGetComic
  | OlderStudioStateFromGetComic;

type StudioStateEditorState = {
  activeEmojiId: number | null;
  currentEmojiId?: number;
};

export type StudioStateImageData = {
  backgroundColor?: string | null; // null for opting out of background rendering e.g. for emoji icons
  emojis: Record<string, EmojiConfigSerialized>;
};

type StudioStateCellData = {
  caption: string;
};

export type StudioState = StudioStateEditorState &
  StudioStateImageData &
  StudioStateCellData;

// This version is returned from GET comic/:comicUrlId
export type StudioStateFromGetComic = StudioStateEditorState & {
  backgroundColor: string;
  caption: string;
  emojis: Record<string, EmojiConfigFromGetComic>;
};

export type OlderStudioStateFromGetComic = StudioStateEditorState & {
  showEmojiPicker: boolean;
  title: string;
  emojis: Record<string, EmojiConfigFromOlderGetComic>;
};
