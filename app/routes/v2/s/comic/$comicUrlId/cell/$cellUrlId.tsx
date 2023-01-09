import type { LinksFunction } from "@remix-run/node";

import CellStudio, {
  links as CellStudioStylesUrl,
} from "~/components/CellStudio";

export const links: LinksFunction = () => {
  return [...CellStudioStylesUrl()];
};

/**
 * MAIN
 */
export default function CellStudioRoute() {
  return <CellStudio />;
}

export const unstable_shouldReload = () => false;
