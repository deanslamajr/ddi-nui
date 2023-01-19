export const CAPTCHA_ACTIONS = {
  CELL_PUBLISH: "cell_publish",
};
export const DEBUGGER_SEARCH_KEY = "debug";
export const DRAFT_SUFFIX = "---draft";
export const MAX_DIRTY_CELLS = 20;
export const S3_ASSET_FILETYPE = "image/png";
export const SCHEMA_VERSION = 4; // TODO should be renamed CURRENT_SCHEMA_VERSION
export const STORAGEKEY_STUDIO = "DDI_STUDIO_STATE";

export const SEARCH_PARAMS = {
  OLDER_OFFSET_QUERYSTRING: "oo",
  NEWER_OFFSET_QUERYSTRING: "no",
  CAPTION_FILTER_QUERYSTRING: "caption",
  EMOJI_FILTER_QUERYSTRING: "emoji",
};

export const EMOJI_CONFIG = {
  MAX_EMOJIS_COUNT: 1000,
  MAX_CAPTION_LENGTH: 255,
  MIN_POSITION: -1000,
  MAX_POSITION: 1000,
  MIN_ROTATION: -180,
  MAX_ROTATION: 180,
  MIN_SIZE: 1,
  MAX_SIZE: 512,
  MIN_SKEW: -1.5,
  MAX_SKEW: 1.5,
  MIN_ALPHA: 0,
  MAX_ALPHA: 1,
  MIN_RGB: 0,
  MAX_RGB: 255,
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
  PAGE_SIZE: 10,
  FILTERS_LIST: ["RGBA"],
};
