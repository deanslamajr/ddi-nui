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

export const RGBA = "RGBA";
const konvaFiltersEnabledInDdi = {
  [RGBA]: Konva.Filters.RGBA,
};

export const EMOJI_MASK_REF_ID = "EMOJI_MASK_REF_ID";
export const EMOJI_MASK_OUTLINE_REF_ID = "EMOJI_MASK_OUTLINE_REF_ID";

const getOffsetsFromTextRef = (
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
      ? emoji.filters.filter((filter) => Boolean(filter))
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
    useCache: true,
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
  backgroundColor: string,
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

  // Add Canvas
  const canvas = new Konva.Rect({
    x: 0,
    y: 0,
    width: theme.canvas.width,
    height: theme.canvas.height,
    fill: backgroundColor,
  });
  layer.add(canvas);

  // Add emojis
  getEmojiConfigs(Object.values(emojis)).forEach((config) => {
    const emoji = new Konva.Text({ ...config });

    const { offsetX, offsetY } = getOffsetsFromTextRef(emoji);

    emoji.offsetX(offsetX);
    emoji.offsetY(offsetY);

    emoji.cache({
      // offset: 100,
      x: offsetX - emoji.getAbsolutePosition().x,
      y: offsetY - emoji.getAbsolutePosition().y,
      pixelRatio: 2, /// fixes android graphics glitch
      // drawBorder: true, /// set 'true' for debugging image drawing
      width: theme.canvas.width,
      height: theme.canvas.height,
    });
    layer.add(emoji);
  });

  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore there are examples in docs of not passing a config
      stage.toCanvas().toBlob((blob) => {
        if (!blob) {
          throw new Error("Konva`s stage.toCanvas.toBlob returned `null`.");
        }
        resolve(blob);
      });
    } catch (err) {
      // @todo log error
      console.error(err);
      reject(err);
    }
  });
};
