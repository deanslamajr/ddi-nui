import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";

import CellStudio, {
  links as CellStudio2StylesUrl,
} from "~/components/CellStudio";
import {
  ComicStudioStateProvider,
  links as comicStudioStateProviderStylesUrl,
} from "~/contexts/ComicStudioState";

export const links: LinksFunction = () => {
  return [...CellStudio2StylesUrl(), ...comicStudioStateProviderStylesUrl()];
};

/**
 * MAIN
 */
export default function CellStudioRoute() {
  const params = useParams();
  const comicUrlId = params.comicUrlId!;

  return (
    <ComicStudioStateProvider comicUrlId={comicUrlId}>
      <CellStudio />
    </ComicStudioStateProvider>
  );
}

// export const unstable_shouldReload = () => false;
