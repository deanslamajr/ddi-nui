import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";

import {
  ComicStudioStateProvider,
  links as comicStudioStateProviderStylesUrl,
} from "~/contexts/ComicStudioState";
import {
  ComicStudio,
  links as comicStudioStylesUrl,
} from "~/components/ComicStudio";

export const links: LinksFunction = () => {
  return [...comicStudioStylesUrl(), ...comicStudioStateProviderStylesUrl()];
};

export default function ComicStudioRoute() {
  const params = useParams();
  const comicUrlId = params.comicUrlId!;

  return (
    <ComicStudioStateProvider comicUrlId={comicUrlId}>
      <ComicStudio />
    </ComicStudioStateProvider>
  );
}
