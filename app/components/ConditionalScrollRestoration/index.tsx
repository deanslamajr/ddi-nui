import { FC, useEffect, useRef } from "react";
import { ScrollRestoration, useLocation } from "@remix-run/react";

// Copied from https://github.com/remix-run/remix/issues/186#issuecomment-1215221484
const ConditionalScrollRestoration: FC<{}> = () => {
  const isFirstRenderRef = useRef(true);
  const location = useLocation();

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  if (
    !isFirstRenderRef.current &&
    location.state != null &&
    typeof location.state === "object" &&
    (location.state as { scroll: boolean }).scroll === false
  ) {
    return null;
  }

  return <ScrollRestoration />;
};

export default ConditionalScrollRestoration;
