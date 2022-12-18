import Konva from "konva";

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
  filters?: Array<typeof Konva.Filters.RGBA>;
  fontSize: number;
  opacity: number;
  text: string;
  useCache: boolean;
};

export type AllEmojiConfigs =
  | EmojiConfigSerialized
  | EmojiConfigFromGetComic
  | EmojiConfigFromOlderGetComic;

// This version is for storing in DB/client cache
export type EmojiConfigSerialized = LatestEmojiConfigBase & {
  emoji: string;
  filters?: Array<typeof Konva.Filters["RGBA"]>;
  id: number;
  opacity?: number;
  order: number;
  size: number;
};

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

type EmojiConfigFromGetComic = {
  emoji: string;
  id: number;
  opacity: number;
  order: number;
  size: number;
} & LatestEmojiConfigBase;

// This version is returned from GET comic/:comicUrlId
export type StudioStateFromGetComic = StudioStateBase & {
  backgroundColor: string;
  caption: string;
  emojis: Record<string, EmojiConfigFromGetComic>;
};

type EmojiConfigFromOlderGetComic = {
  emoji: string;
  id: number;
  order: number;
  size: number;
} & EmojiConfigBase;

export type OlderStudioStateFromGetComic = StudioStateBase & {
  showEmojiPicker: boolean;
  title: string;
  emojis: Record<string, EmojiConfigFromOlderGetComic>;
};
