import { Filters } from "konva";

import { RGBA } from "~/utils/konva";

type EmojiConfigBase = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  rotation: number;
  alpha: number;
  red: number;
  green: number;
  blue: number;
};

// This version is for storing in DB/client cache
export type EmojiConfigSerialized = EmojiConfigBase & {
  emoji: string;
  filters?: [typeof RGBA];
  id: number;
  opacity?: number;
  order: number;
  size: number;
};

// This version is for rendering comics
export type EmojiConfigJs = EmojiConfigBase & {
  "data-id": number | string;
  filters?: Array<typeof Filters.RGA>;
  fontSize: number;
  opacity: number;
  text: string;
  useCache: boolean;
};

export type StudioState = {
  activeEmojiId: number;
  backgroundColor: string;
  caption: string;
  currentEmojiId: number;
  emojis: Record<string, EmojiConfigSerialized>;
};
