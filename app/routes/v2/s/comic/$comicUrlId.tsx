import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";

import {
  ComicStudioStateProvider,
  links as comicStudioStateProviderStylesUrl,
} from "~/contexts/ComicStudioState";
import { CellImageProvider } from "~/contexts/CellImageGenerator";
import {
  ComicStudio,
  links as comicStudioStylesUrl,
} from "~/components/ComicStudio";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...comicStudioStylesUrl(),
    ...comicStudioStateProviderStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export default function ComicStudioRoute() {
  const params = useParams();
  const comicUrlId = params.comicUrlId!;

  return (
    <div className="comic-studio-outer-container">
      <ComicStudioStateProvider comicUrlId={comicUrlId}>
        <CellImageProvider>
          <ComicStudio />
        </CellImageProvider>
      </ComicStudioStateProvider>
    </div>
  );
}
