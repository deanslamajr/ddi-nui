import type { LinksFunction } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import classnames from "classnames";
import { useEffect, useState } from "react";

import stylesUrl from "~/styles/components/ShowMore.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const OLDER_OFFSET_QUERYSTRING = "oo";
export const NEWER_OFFSET_QUERYSTRING = "no";
export const CAPTION_FILTER_QUERYSTRING = "caption";
export const EMOJI_FILTER_QUERYSTRING = "emoji";

export default function ShowMore({
  isNewer,
  isVisible,
  offset,
  onClick: onClickFromConsumer,
  urlPathForGalleryData,
}: {
  isNewer?: boolean;
  isVisible: boolean;
  offset: string | null;
  onClick?: () => void;
  urlPathForGalleryData?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const transition = useTransition();
  const isSomethingOnPageLoading = transition.state === "submitting";

  useEffect(() => {
    if (transition.state === "idle" && isLoading) {
      setIsLoading(false);
    }
  }, [transition.state]);

  const onClick = () => {
    if (onClickFromConsumer) {
      onClickFromConsumer();
    }
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
        },
        {
          absolute: !isNewer,
        }
      )}
    >
      <Form replace action={urlPathForGalleryData}>
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
