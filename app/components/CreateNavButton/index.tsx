import { Form, LinksFunction } from "remix";

import { DDI_API_ENDPOINTS, DDI_APP_PAGES } from "~/utils/urls";

import UnstyledLink, {
  links as unstyledLinkStylesUrl,
} from "~/components/UnstyledLink";

import stylesUrl from "./create-nav-button.css";

export const links: LinksFunction = () => {
  return [...unstyledLinkStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

type Props = {};

export default function CreateNavButton({}: Props) {
  return (
    <UnstyledLink href={DDI_APP_PAGES.getDraftsPageUrl()}>
      <div className="nav-button bottom-right accented create">+</div>
    </UnstyledLink>
  );
}
