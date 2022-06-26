import { Link, LinksFunction } from "remix";
import classnames from "classnames";

import stylesUrl from "./new-comics-exist.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  isVisible: boolean;
};

const NewComicsExistButton: React.FC<Props> = ({ isVisible }) => {
  return isVisible ? (
    <a
      href="/"
      className={classnames("nav-button", "accented", "new-comics-exist")}
    >
      <button>🆕</button>
    </a>
  ) : null;
};

export default NewComicsExistButton;
