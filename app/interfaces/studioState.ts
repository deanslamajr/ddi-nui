import { Filters } from "konva";

import { RGBA } from "~/utils/konva";

type EmojiConfigBase = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  alpha: number;
  red: number;
  green: number;
  blue: number;
};

type LatestEmojiConfigBase = EmojiConfigBase & {
  skewX: number;
  skewY: number;
};

// This version is for rendering comics
export type EmojiConfigJs = LatestEmojiConfigBase & {
  "data-id": number | string;
  filters?: Array<typeof Filters.RGA>;
  fontSize: number;
  opacity: number;
  text: string;
  useCache: boolean;
};

// This version is for storing in DB/client cache
export type EmojiConfigSerialized = LatestEmojiConfigBase & {
  emoji: string;
  filters?: [typeof RGBA];
  id: number;
  opacity?: number;
  order: number;
  size: number;
};

export type StudioState = {
  activeEmojiId: number;
  backgroundColor: string;
  caption: string;
  currentEmojiId: number;
  emojis: Record<string, EmojiConfigSerialized>;
};

// This version is returned from GET comic/:comicUrlId
export type StudioStateFromGetComic = {
  activeEmojiId: number;
  backgroundColor: string;
  caption: string;
  currentEmojiId: number;
  emojis: Record<
    string,
    {
      emoji: string;
      id: number;
      opacity: number;
      order: number;
      size: number;
    } & LatestEmojiConfigBase
  >;
};

export type OlderStudioStateFromGetComic = {
  activeEmojiId: number;
  currentEmojiId: number;
  showEmojiPicker: boolean;
  title: string;
  emojis: Record<
    string,
    {
      emoji: string;
      id: number;
      order: number;
      size: number;
    } & EmojiConfigBase
  >;
};
