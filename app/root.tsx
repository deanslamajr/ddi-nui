import {
  json,
  Links,
  LinksFunction,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import globalStylesUrl from "~/styles/global.css";
import largeGlobalStylesUrl from "~/styles/global-large.css";
import mediumGlobalStylesUrl from "~/styles/global-medium.css";

import { theme } from "~/utils/stylesTheme";
import { phoneMax } from "~/components/breakpoints";

import { ClientEnvironmentVariables } from "~/interfaces/environment-variables";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.colors.lightGray};
    margin: 0;
    color: ${theme.colors.black};
    font-family: ${theme.fonts};

    ${phoneMax`
      overflow-x: hidden;
    `}
  }
`;

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStylesUrl },
    {
      rel: "stylesheet",
      href: largeGlobalStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
    {
      rel: "stylesheet",
      href: mediumGlobalStylesUrl,
      media: "print, (min-width: 640px)",
    },
  ];
};

export async function loader() {
  const ENV: ClientEnvironmentVariables = {
    CELL_IMAGES_URL: process.env.CELL_IMAGES_URL,
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
        <meta charSet="utf-8" />
        <title>draw draw ink</title>
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        {/* Commented out bc it was causing an issue with the process reference in the logs of index.tsx */}
        {/* <Scripts /> */}
        <LiveReload />
      </body>
    </html>
  );
}
