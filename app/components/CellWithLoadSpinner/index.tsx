import type { LinksFunction } from "@remix-run/node";
import classNames from "classnames";

import { getClientVariable } from "~/utils/environment-variables";

import stylesUrl from "~/styles/components/CellWithLoadSpinner.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const spinnerUrlAsCssVariable = {
  "--spinner-url": `url("${getClientVariable(
    "FAVICON_URL_WITH_PROTOCOL"
  )}/shaka.gif")`,
} as React.CSSProperties;

const LoadSpinner: React.FC<{
  className?: string;
  percentCompleted?: number;
}> = ({ className, percentCompleted }) => {
  return (
    <span className={classNames("load-spinner-container", className)}>
      <div className="load-spinner" style={spinnerUrlAsCssVariable}>
        {Number.isFinite(percentCompleted) && (
          <span className="load-spinner-counter">{percentCompleted}&#37;</span>
        )}
      </div>
    </span>
  );
};

export default LoadSpinner;
