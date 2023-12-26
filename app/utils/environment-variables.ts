import {
  ClientEnvironmentVariables,
  Window,
} from "~/interfaces/environment-variables";
import isServerContext from "./isServerContext";

export const getClientVariable = (
  variableName: keyof ClientEnvironmentVariables
): string => {
  if (isServerContext()) {
    // running in a server environment
    return process.env[variableName] || "";
  } else {
    // running in a browser environment
    return (window as unknown as Window).ENV[variableName] || "";
  }
};
