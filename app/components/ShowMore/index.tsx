import { Link, useTransition } from "@remix-run/react";
import classnames from "classnames";
import { useEffect, useState } from "react";

import { SEARCH_PARAMS } from "~/utils/constants";

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

  const getLink = (): string => {
    const searchParamKey = isNewer
      ? SEARCH_PARAMS.NEWER_OFFSET_QUERYSTRING
      : SEARCH_PARAMS.OLDER_OFFSET_QUERYSTRING;
    return `${urlPathForGalleryData}?${searchParamKey}=${offset}`;
  };

  return typeof offset === "string" ? (
    <Link
      prefetch="render"
      replace={true}
      className={classnames(
        "nav-button",
        "large-icon",
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
      onClick={onClick}
      to={getLink()}
      state={{ scroll: false }}
    >
      {isLoading ? "🤙" : isNewer ? "↑" : "↓"}
    </Link>
  ) : null;
}
