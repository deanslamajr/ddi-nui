import { Links, LinksFunction, LiveReload, Outlet } from "remix";

import globalStylesUrl from "~/styles/global.css";
import largeGlobalStylesUrl from "~/styles/global-large.css";
import mediumGlobalStylesUrl from "~/styles/global-medium.css";

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

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
