import Konva from "konva";

/*******************
 ***********
 * TYPES
 */

export type EmojiRef = Konva.Text | null;
export type EmojiRefs = Record<string, EmojiRef>;

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

export type EmojiConfigFromOlderGetComic = {
  emoji: string;
  id: number;
  order: number;
  size: number;
} & EmojiConfigBase;

type LatestEmojiConfigBase = EmojiConfigBase & {
  skewX: number;
  skewY: number;
};

export type EmojiConfigFromGetComic = {
  emoji: string;
  id: number;
  opacity: number;
  order: number;
  size: number;
} & LatestEmojiConfigBase;

// This version is for rendering comics
export type EmojiConfigJs = LatestEmojiConfigBase & {
  "data-id": number | string;
  filters?: Array<typeof Konva.Filters.RGBA>;
  fontSize: number;
  opacity: number;
  text: string;
  useCache: boolean;
  offsetX: number;
  offsetY: number;
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

export const DEFAULT_EMOJI_CONFIG: EmojiConfigSerialized = {
  emoji: "🤙",
  filters: undefined,
  id: 0,
  opacity: 1,
  order: 0,
  size: 100,
  skewX: 0,
  skewY: 0,
  rotation: 0,
  x: 100,
  y: 100,
  scaleX: 1,
  scaleY: 1,
  alpha: 0.5,
  red: 125,
  green: 0,
  blue: 0,
};

/*******************
 ***********
 * CRUD
 */

export function createNewEmojiComponentState(
  emoji: string,
  currentEmojiId: number
): EmojiConfigSerialized {
  return {
    ...DEFAULT_EMOJI_CONFIG,
    emoji,
    id: currentEmojiId,
    order: currentEmojiId,
  };
}
