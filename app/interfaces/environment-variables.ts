export type ClientEnvironmentVariables = {
  CELL_IMAGES_URL: string;
  LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL: string;
  ASSETS_URL_WITH_PROTOCOL: string;
};

export type ServerEnvironmentVariables = {};

export type EnvironmentVariables = ClientEnvironmentVariables &
  ServerEnvironmentVariables;

export interface Window {
  ENV: ClientEnvironmentVariables;
}
