export type ClientEnvironmentVariables = {
  APP_PATH_PREFIX: string;
  CAPTCHA_V2_SITE_KEY: string;
  CAPTCHA_V3_SITE_KEY: string;
  CELL_IMAGES_URL: string;
  CELL_IMAGES_URL_PROD: string;
  LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL: string;
  LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL_PROD: string;
  ASSETS_URL_WITH_PROTOCOL: string;
  FAVICON_URL_WITH_PROTOCOL: string;
  NR_ACCOUNT_ID: string;
  NR_APP_ID_REMIX_DDI_CLIENT: string;
  NR_BROWSER_KEY: string;
};

export type ServerEnvironmentVariables = {};

export type EnvironmentVariables = ClientEnvironmentVariables &
  ServerEnvironmentVariables;

export interface Window {
  ENV: ClientEnvironmentVariables;
}
