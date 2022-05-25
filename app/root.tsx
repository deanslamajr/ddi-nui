import {
  json,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  ErrorBoundaryComponent,
} from "remix";
import type { ShouldReloadFunction } from "@remix-run/react";
import { ThemeProvider } from "styled-components";

import globalStylesUrl from "~/styles/global.css";
import cssTheme from "~/styles/variables.css";

import { theme } from "~/utils/stylesTheme";

import { ClientEnvironmentVariables } from "~/interfaces/environment-variables";

// don't rerun the loader on client actions
export const unstable_shouldReload: ShouldReloadFunction = () => false;

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: cssTheme },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export async function loader() {
  const ENV: ClientEnvironmentVariables = {
    CELL_IMAGES_URL: process.env.CELL_IMAGES_URL || "",
    LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL:
      process.env.LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL || "",
    ASSETS_URL_WITH_PROTOCOL: process.env.ASSETS_URL_WITH_PROTOCOL || "",
    NR_ACCOUNT_ID: process.env.NR_ACCOUNT_ID || "",
    NR_APP_ID_REMIX_DDI_CLIENT: process.env.NR_APP_ID_REMIX_DDI_CLIENT || "",
    NR_BROWSER_KEY: process.env.NR_BROWSER_KEY || "",
  };

  return json({
    ENV,
  });
}

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <title>draw draw ink</title>
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <script type="text/javascript" src="./newRelic.js"></script>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <html>
      <head>
        <title>draw draw ink - Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        Sorry, there was an error. Please try refreshing the page.
        <Scripts />
      </body>
    </html>
  );
};
