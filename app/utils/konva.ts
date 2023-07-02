import { EmojiConfigSerialized, EmojiConfigJs } from "~/models/emojiConfig";
import { theme } from "~/utils/stylesTheme";
import { EmojiRef, EmojiRefs } from "~/models/emojiConfig";

import Konva from "konva";

import { sortByOrder } from "~/utils/sortCells";

/**
 * EXPORTS
 ****
 ***
 **
 */

export const PIXEL_RATIO = 1;

export type KonvaFilters = {
  RGBA: typeof Konva.Filters["RGBA"];
  BLUR: typeof Konva.Filters["Blur"];
};

export const RGBA = "RGBA";
export const BLUR = "BLUR";
const konvaFiltersEnabledInDdi: KonvaFilters = {
  [RGBA]: Konva.Filters.RGBA,
  [BLUR]: Konva.Filters.Blur,
};

export const EMOJI_MASK_REF_ID = "EMOJI_MASK_REF_ID";
export const EMOJI_MASK_OUTLINE_REF_ID = "EMOJI_MASK_OUTLINE_REF_ID";

export const getOffsetsFromTextRef = (
  emojiRef?: EmojiRef
): { offsetX: number; offsetY: number } => {
  const offsetX = emojiRef ? emojiRef.width() / 2 : 0;
  const offsetY = emojiRef ? emojiRef.height() / 2 : 0;
  return {
    offsetX,
    offsetY,
  };
};

export const getKonvaConfigFromEmojiConfig = (
  emoji: EmojiConfigSerialized,
  emojiRef?: EmojiRef
): EmojiConfigJs => {
  const { offsetX, offsetY } = getOffsetsFromTextRef(emojiRef);
  return {
    "data-id": emoji.id,
    filters: emoji.filters
      ? emoji.filters
          .map((filter) => konvaFiltersEnabledInDdi[filter])
          .filter((filter) => Boolean(filter))
      : [],
    x: emoji.x,
    y: emoji.y,
    scaleX: emoji.scaleX,
    scaleY: emoji.scaleY,
    skewX: emoji.skewX,
    skewY: emoji.skewY,
    text: emoji.emoji,
    fontSize: emoji.size,
    rotation: emoji.rotation,
    alpha: emoji.alpha,
    red: emoji.red,
    green: emoji.green,
    blue: emoji.blue,
    opacity:
      typeof emoji.opacity !== "undefined"
        ? emoji.opacity
        : 1 /* backwards compatibility */,
    offsetX,
    offsetY,
  };
};

export const getEmojiConfigs = (
  emojis: EmojiConfigSerialized[],
  emojiRefs?: EmojiRefs
): EmojiConfigJs[] => {
  return emojis.sort(sortByOrder).map((emoji) => {
    const emojiRef = emojiRefs && emojiRefs[emoji.id];
    return getKonvaConfigFromEmojiConfig(emoji, emojiRef);
  });
};

export const generateCellImage = (
  emojis: Record<string, EmojiConfigSerialized>,
  backgroundColor: string | null,
  htmlElementId: string
): Promise<Blob> => {
  const stageHeight = theme.canvas.height;
  const stageWidth = theme.canvas.width;

  const stage = new Konva.Stage({
    container: htmlElementId,
    width: stageWidth,
    height: stageHeight,
  });

  const layer = new Konva.Layer();
  // add the layer to the stage
  stage.add(layer);

  // optionally: Add Canvas
  if (backgroundColor) {
    const canvas = new Konva.Rect({
      x: 0,
      y: 0,
      width: theme.canvas.width,
      height: theme.canvas.height,
      fill: backgroundColor,
    });
    layer.add(canvas);
  }

  // Add emojis
  getEmojiConfigs(Object.values(emojis)).forEach((config) => {
    const emoji = new Konva.Text({ ...config });

    const { offsetX, offsetY } = getOffsetsFromTextRef(emoji);

    emoji.offsetX(offsetX);
    emoji.offsetY(offsetY);

    emoji.cache({
      offset: 100, // to account for larger sized emojis
      pixelRatio: PIXEL_RATIO,
      // drawBorder: true, // set 'true' for debugging coverage of cache
    });
    layer.add(emoji);
  });

  return new Promise((resolve, reject) => {
    try {
      stage.toBlob({
        pixelRatio: PIXEL_RATIO,
        quality: 1,
        callback: (blob) => {
          if (!blob) {
            throw new Error("Konva`s stage.toCanvas.toBlob returned `null`.");
          }
          resolve(blob);
        },
      });
    } catch (err) {
      // @todo log error
      console.error(err);
      reject(err);
    }
  });
};
