import React from "react";

import type { LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";
import { ComicFromClientCache, getDirtyComics } from "~/utils/clientCache";

import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";

export const links: LinksFunction = () => {
  return [...unstyledLinkStylesUrl()];
};

type Props = {};

export default function CreateNavButton({}: Props) {
  const [searchParams] = useSearchParams();
  const [draftComics, setDraftComics] = React.useState<ComicFromClientCache[]>(
    []
  );

  React.useEffect(() => {
    const dirtyComics = getDirtyComics();
    setDraftComics(dirtyComics);
  }, [searchParams, setDraftComics]);

  const href = draftComics.length
    ? DDI_APP_PAGES.drafts(searchParams.toString())
    : DDI_APP_PAGES.cellStudio();

  return (
    <UnstyledLink href={href}>
      <div className="nav-button bottom-right accented larger-font">+</div>
    </UnstyledLink>
  );
}
