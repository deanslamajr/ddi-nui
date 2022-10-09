import type { LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";

import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";

export const links: LinksFunction = () => {
  return [...unstyledLinkStylesUrl()];
};

type Props = {};

export default function CreateNavButton({}: Props) {
  const [searchParams] = useSearchParams();

  return (
    <UnstyledLink href={DDI_APP_PAGES.drafts(searchParams.toString())}>
      <div className="nav-button bottom-right accented larger-font">+</div>
    </UnstyledLink>
  );
}
