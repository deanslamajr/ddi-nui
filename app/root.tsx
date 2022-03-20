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

import globalStylesUrl from "~/styles/global.css";
import largeGlobalStylesUrl from "~/styles/global-large.css";
import mediumGlobalStylesUrl from "~/styles/global-medium.css";

import { ClientEnvironmentVariables } from "~/interfaces/environment-variables";

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
        <Outlet />
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
