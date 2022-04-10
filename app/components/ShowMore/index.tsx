import { Form, LinksFunction } from "remix";
import classnames from "classnames";

import stylesUrl from "./show-more.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  offset: string | null;
  isNewer?: boolean;
  isVisible: boolean;
};

export const OLDER_OFFSET_QUERYSTRING = "oo";
export const NEWER_OFFSET_QUERYSTRING = "no";

export default function ShowMore({ isNewer, isVisible, offset }: Props) {
  const isDisabled = !isVisible;

  return typeof offset === "string" ? (
    <div
      className={classnames("nav-button", "bottom-center", "show-more", {
        disabled: isDisabled,
      })}
    >
      <Form replace>
        {isNewer ? (
          <input
            type="checkbox"
            id="showmore"
            name={NEWER_OFFSET_QUERYSTRING}
            value={offset}
            defaultChecked
            hidden
          />
        ) : (
          <input
            type="checkbox"
            id="showmore"
            name={OLDER_OFFSET_QUERYSTRING}
            value={offset}
            defaultChecked
            hidden
          />
        )}
        <button disabled={!isVisible} type="submit">
          {isNewer ? "↑" : "↓"}
        </button>
      </Form>
    </div>
  ) : null;
}
