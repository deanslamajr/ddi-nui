import shortid from "shortid";

import { EMOJI_CONFIG } from "./constants";

import { AllStudioStateVersions, StudioState } from "~/interfaces/studioState";
import { AllEmojiConfigs, EmojiConfigSerialized } from "~/models/emojiConfig";

import { theme } from "~/utils/stylesTheme";

import { DEFAULT_EMOJI_CONFIG } from "~/models/emojiConfig";

const {
  MAX_EMOJIS_COUNT,
  MIN_POSITION,
  MAX_POSITION,
  MIN_ROTATION,
  MAX_ROTATION,
  MIN_SIZE,
  MAX_SIZE,
  MIN_SKEW,
  MAX_SKEW,
  MIN_ALPHA,
  MAX_ALPHA,
  MIN_RGB,
  MAX_RGB,
  MIN_OPACITY,
  MAX_OPACITY,
  MAX_CAPTION_LENGTH,
  FILTERS_LIST,
} = EMOJI_CONFIG;

export const DEFAULT_STUDIO_STATE: StudioState = {
  activeEmojiId: 1,
  backgroundColor: theme.colors.white,
  caption: "",
  currentEmojiId: 1,
  emojis: {},
};

const STUDIO_STATE_VALIDATION_ERROR = "STUDIO_STATE_VALIDATION_ERROR:";

const ERR_FILENAME_INVALID = "the given filename is invalid";
const ERR_CANNOT_BE_NEGATIVE = "cannot be a negative value";
const ERR_INCORRECT_SCALE_VALUE = "must be either -1 or 1";
const ERR_MUST_BE_A_NUMBER = "must be a number type";
const ERR_MUST_BE_A_STRING = "must be a string type";
const ERR_EXCEED_MAX_EMOJIS = `Emojis datastructure cannot exceed a count of ${MAX_EMOJIS_COUNT} emojis`;
const ERR_MUST_BE_A_HEX_COLOR = "must be a valid hex color string";

export function validateCaption(caption: any) {
  if (typeof caption !== "string") {
    return DEFAULT_STUDIO_STATE.caption;
  }

  if (caption.length > MAX_CAPTION_LENGTH) {
    return caption.substring(0, MAX_CAPTION_LENGTH);
  }

  return caption;
}

export function validateFilename(filename: string) {
  if (!filename.includes(".png")) {
    throw new Error(ERR_FILENAME_INVALID);
  }

  const filenameWithoutExt = filename.slice(0, -4);

  if (!shortid.isValid(filenameWithoutExt)) {
    throw new Error(ERR_FILENAME_INVALID);
  }

  if (filenameWithoutExt.length > 14) {
    throw new Error(ERR_FILENAME_INVALID);
  }
}

export function validateId(id: any, defaultValue: number, field: string) {
  // must be a number
  if (typeof id !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }
  // must be >= 0
  if (id < 0) {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_CANNOT_BE_NEGATIVE}`
    );
    return defaultValue;
  }
  return id;
}

export function validateBackgroundColor(hex: any, field: string) {
  if (typeof hex !== "string") {
    return DEFAULT_STUDIO_STATE.backgroundColor;
  }

  const hexRegExp = /^#[0-9A-F]{6}$/i;
  if (!hexRegExp.test(hex)) {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_HEX_COLOR}`
    );
    return DEFAULT_STUDIO_STATE.backgroundColor;
  }
  return hex;
}

export function validatePosition(
  value: any,
  defaultValue: number,
  field: string
) {
  // must be a number
  if (typeof value !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }

  if (value < MIN_POSITION) {
    return defaultValue;
  } else if (value > MAX_POSITION) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateSkew(value: any, defaultValue: number) {
  if (typeof value !== "number") {
    return 0;
  } else if (value < MIN_SKEW) {
    return defaultValue;
  } else if (value > MAX_SKEW) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateEmojiField(value: any) {
  // must be a string type
  if (typeof value !== "string") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}emoji.emoji ${ERR_MUST_BE_A_STRING}`
    );
    return DEFAULT_EMOJI_CONFIG.emoji;
  }

  if (value.length > 255) {
    return value.substring(0, 8);
  }

  return value;
}

export function validateScale(value: any, defaultValue: number, field: string) {
  // Must be a number
  if (typeof value !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }

  if (value !== -1 && value !== 1) {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_INCORRECT_SCALE_VALUE}`
    );
    return defaultValue;
  }

  return value;
}

export function validateRotation(
  value: any,
  defaultValue: number,
  field: string
) {
  // Must be a number
  if (typeof value !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }

  if (value < MIN_ROTATION) {
    return defaultValue;
  } else if (value > MAX_ROTATION) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateSize(value: any, defaultValue: number, field: string) {
  // Must be a number
  if (typeof value !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }

  if (value < MIN_SIZE) {
    return defaultValue;
  } else if (value > MAX_SIZE) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateAlpha(value: any, defaultValue: number, field: string) {
  // Must be a number
  if (typeof value !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }

  if (value < MIN_ALPHA) {
    return defaultValue;
  } else if (value > MAX_ALPHA) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateRGB(value: any, defaultValue: number, field: string) {
  // Must be a number
  if (typeof value !== "number") {
    console.warn(
      `${STUDIO_STATE_VALIDATION_ERROR}${field} ${ERR_MUST_BE_A_NUMBER}`
    );
    return defaultValue;
  }

  if (value < MIN_RGB) {
    return defaultValue;
  } else if (value > MAX_RGB) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateOpacity(value: any, defaultValue: number) {
  // Must be a number
  if (typeof value !== "number") {
    return defaultValue;
  }

  if (value < MIN_OPACITY) {
    return defaultValue;
  } else if (value > MAX_OPACITY) {
    return defaultValue;
  } else {
    return value;
  }
}

export function validateFilters(filters: any) {
  if (!filters || !Array.isArray(filters)) {
    return undefined;
  }

  const withoutUnrecognized = filters.filter((filter) =>
    FILTERS_LIST.includes(filter)
  );

  if (!withoutUnrecognized.length) {
    return undefined;
  }

  // remove duplicates
  return Array.from(new Set(withoutUnrecognized));
}

export function validateEmojiDatastructure(
  emojiConfig: Partial<AllEmojiConfigs>
) {
  return {
    emoji: validateEmojiField(emojiConfig.emoji),
    id: validateId(emojiConfig.id, DEFAULT_EMOJI_CONFIG.id, "emojiConfig.id"),
    order: validateId(
      emojiConfig.order,
      DEFAULT_EMOJI_CONFIG.order,
      "emojiConfig.order"
    ),
    x: validatePosition(emojiConfig.x, DEFAULT_EMOJI_CONFIG.x, "emojiConfig.x"),
    y: validatePosition(emojiConfig.y, DEFAULT_EMOJI_CONFIG.y, "emojiConfig.y"),
    scaleX: validateScale(
      emojiConfig.scaleX,
      DEFAULT_EMOJI_CONFIG.scaleX,
      "emojiConfig.scaleX"
    ),
    scaleY: validateScale(
      emojiConfig.scaleY,
      DEFAULT_EMOJI_CONFIG.scaleY,
      "emojiConfig.scaleY"
    ),
    skewX: validateSkew(
      (emojiConfig as EmojiConfigSerialized).skewX,
      DEFAULT_EMOJI_CONFIG.scaleX
    ),
    skewY: validateSkew(
      (emojiConfig as EmojiConfigSerialized).skewY,
      DEFAULT_EMOJI_CONFIG.scaleY
    ),
    rotation: validateRotation(
      emojiConfig.rotation,
      DEFAULT_EMOJI_CONFIG.rotation,
      "emojiConfig.rotation"
    ),
    size: validateSize(
      emojiConfig.size,
      DEFAULT_EMOJI_CONFIG.size,
      "emojiConfig.size"
    ),
    alpha: validateAlpha(
      emojiConfig.alpha,
      DEFAULT_EMOJI_CONFIG.size,
      "emojiConfig.alpha"
    ),
    red: validateRGB(
      emojiConfig.red,
      DEFAULT_EMOJI_CONFIG.red,
      "emojiConfig.red"
    ),
    green: validateRGB(
      emojiConfig.green,
      DEFAULT_EMOJI_CONFIG.green,
      "emojiConfig.green"
    ),
    blue: validateRGB(
      emojiConfig.blue,
      DEFAULT_EMOJI_CONFIG.blue,
      "emojiConfig.blue"
    ),
    opacity: validateOpacity(
      (emojiConfig as EmojiConfigSerialized).opacity,
      DEFAULT_EMOJI_CONFIG.opacity!
    ),
    filters: validateFilters((emojiConfig as EmojiConfigSerialized).filters),
  };
}

export function validateEmojis(emojis: any): StudioState["emojis"] {
  // EmojiConfigs are stored as object
  // Arrays are type object so need to protect against this case
  if (typeof emojis !== "object" || Array.isArray(emojis)) {
    return { ...DEFAULT_STUDIO_STATE.emojis };
  }

  const emojisArray = Object.values(emojis as Record<string, any>);

  if (emojisArray.length > MAX_EMOJIS_COUNT) {
    console.warn(`${STUDIO_STATE_VALIDATION_ERROR}${ERR_EXCEED_MAX_EMOJIS}`);
    emojisArray.length = MAX_EMOJIS_COUNT; // this actually works!
  }

  return emojisArray.reduce((validatedEmojis, nextEmojiToValidate) => {
    const validatedEmoji = validateEmojiDatastructure(nextEmojiToValidate);
    return {
      ...validatedEmojis,
      [validatedEmoji.id]: validatedEmoji,
    };
  }, {} as Record<string, EmojiConfigSerialized>);
}

export function validateStudioState(
  studioState?: AllStudioStateVersions | null
): StudioState {
  return {
    activeEmojiId: validateId(
      (studioState as StudioState | null)?.activeEmojiId,
      DEFAULT_STUDIO_STATE.activeEmojiId,
      "activeEmojiId"
    ),
    backgroundColor: validateBackgroundColor(
      (studioState as StudioState | null)?.backgroundColor,
      "backgroundColor"
    ),
    currentEmojiId: validateId(
      (studioState as StudioState | null)?.currentEmojiId,
      DEFAULT_STUDIO_STATE.currentEmojiId,
      "currentEmojiId"
    ),
    caption: validateCaption((studioState as StudioState | null)?.caption),
    emojis: validateEmojis((studioState as StudioState | null)?.emojis),
  };
}
