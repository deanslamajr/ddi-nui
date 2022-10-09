import type { LinksFunction } from "@remix-run/node";
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
  percentCompleted?: number;
}> = ({ percentCompleted }) => {
  return (
    <span className="load-spinner-container">
      <div className="load-spinner" style={spinnerUrlAsCssVariable}>
        {Number.isFinite(percentCompleted) && (
          <span className="load-spinner-counter">{percentCompleted}&#37;</span>
        )}
      </div>
    </span>
  );
};

export default LoadSpinner;
