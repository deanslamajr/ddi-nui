import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { DDI_APP_PAGES } from "~/utils/urls";

import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/cell/$cellUrlId.css";

export const links: LinksFunction = () => {
  return [...unstyledLinkStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

/**
 * MAIN
 */
export default function ComicStudioRoute() {
  const params = useParams();

  const comicUrlId = params.comicUrlId!;

  const getExitNavLink = () => {
    return DDI_APP_PAGES.comicStudio(comicUrlId);
  };

  return (
    <>
      <UnstyledLink href={getExitNavLink()}>
        <div className="nav-button bottom-left large-icon">🔙</div>
      </UnstyledLink>
    </>
  );
}

export const unstable_shouldReload = () => false;
