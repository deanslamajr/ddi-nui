import { Form, LinksFunction } from "remix";
import { useTransition } from "@remix-run/react";
import classnames from "classnames";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const transition = useTransition();
  const isSomethingOnPageLoading = transition.state === "submitting";

  useEffect(() => {
    if (transition.state === "idle" && isLoading) {
      setIsLoading(false);
    }
  }, [transition.state]);

  const onClick = () => {
    setIsLoading(true);
  };

  return typeof offset === "string" ? (
    <div
      className={classnames(
        "nav-button",
        "show-more",
        {
          disabled: !isVisible,
          loading: isLoading,
        },
        {
          ["bottom-center"]: !isNewer,
          ["top-center"]: isNewer,
        }
      )}
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
        <button
          disabled={!isVisible || isSomethingOnPageLoading}
          type="submit"
          onClick={onClick}
        >
          {isLoading ? "🤙" : isNewer ? "↑" : "↓"}
        </button>
      </Form>
    </div>
  ) : null;
}
