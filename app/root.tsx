import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useSearchParams,
  ShouldReloadFunction,
} from "@remix-run/react";
import { ErrorBoundaryComponent, LinksFunction, json } from "@remix-run/node";
import { ThemeProvider } from "styled-components";

import rootStylesPath from "~/styles/root.css";
import cssThemePath from "~/styles/theme.css";

import { theme } from "~/utils/stylesTheme";
import { getClientVariable } from "~/utils/environment-variables";
import { DEBUGGER_SEARCH_KEY } from "~/utils/constants";

import Debugger from "~/components/Debugger";
import ConditionalScrollRestoration from "~/components/ConditionalScrollRestoration";

import { ClientEnvironmentVariables } from "~/interfaces/environment-variables";

// don't rerun the loader on client actions
export const unstable_shouldReload: ShouldReloadFunction = () => false;

export const links: LinksFunction = () => {
  const faviconUrl = getClientVariable("FAVICON_URL_WITH_PROTOCOL");
  const favicons = faviconUrl
    ? [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: `${faviconUrl}/apple-touch-icon.png`,
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: `${faviconUrl}/favicon-32x32.png`,
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: `${faviconUrl}/favicon-16x16.png`,
        },
        {
          rel: "manifest",
          href: `${faviconUrl}/site.webmanifest`,
        },
        {
          rel: "mask-icon",
          href: `${faviconUrl}/safari-pinned-tab.svg`,
          color: "#5bbad5",
        },
        {
          rel: "shortcut icon",
          href: `${faviconUrl}/favicon.ico`,
        },
      ]
    : [];

  return [
    { rel: "stylesheet", href: cssThemePath },
    { rel: "stylesheet", href: rootStylesPath },
    ...favicons,
  ];
};

export async function loader() {
  const ENV: ClientEnvironmentVariables = {
    APP_PATH_PREFIX: process.env.APP_PATH_PREFIX || "",
    CAPTCHA_V2_SITE_KEY: process.env.CAPTCHA_V2_SITE_KEY || "",
    CAPTCHA_V3_SITE_KEY: process.env.CAPTCHA_V3_SITE_KEY || "",
    CELL_IMAGES_URL: process.env.CELL_IMAGES_URL || "",
    LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL:
      process.env.LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL || "",
    ASSETS_URL_WITH_PROTOCOL: process.env.ASSETS_URL_WITH_PROTOCOL || "",
    FAVICON_URL_WITH_PROTOCOL: process.env.FAVICON_URL_WITH_PROTOCOL || "",
    NR_ACCOUNT_ID: process.env.NR_ACCOUNT_ID || "",
    NR_APP_ID_REMIX_DDI_CLIENT: process.env.NR_APP_ID_REMIX_DDI_CLIENT || "",
    NR_BROWSER_KEY: process.env.NR_BROWSER_KEY || "",
  };

  return json({
    ENV,
  });
}

export default function App() {
  const data = useLoaderData<{ ENV: ClientEnvironmentVariables }>();
  const [searchParams] = useSearchParams();
  const isDebuggerEnabled = Boolean(searchParams.has(DEBUGGER_SEARCH_KEY));

  return (
    <html lang="en">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content={`${data.ENV.FAVICON_URL_WITH_PROTOCOL}/browserconfig.xml`}
        />
        <meta name="theme-color" content="#ffffff" />
        <title>draw draw ink</title>
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        {isDebuggerEnabled && <Debugger />}
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
        <ConditionalScrollRestoration />
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
