import { LinksFunction } from "remix";
import { useSearchParams } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";

import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";

import stylesUrl from "~/styles/components/CreateNavButton.css";

export const links: LinksFunction = () => {
  return [...unstyledLinkStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

type Props = {};

export default function CreateNavButton({}: Props) {
  const [searchParams] = useSearchParams();

  return (
    <UnstyledLink
      href={DDI_APP_PAGES.getDraftsPageUrl(searchParams.toString())}
    >
      <div className="nav-button bottom-right accented create">+</div>
    </UnstyledLink>
  );
}
