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
} from "remix";
import { ThemeProvider } from "styled-components";

import globalStylesUrl from "~/styles/global.css";
import cssTheme from "~/styles/variables.css";

import { theme } from "~/utils/stylesTheme";

import { ClientEnvironmentVariables } from "~/interfaces/environment-variables";

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
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
