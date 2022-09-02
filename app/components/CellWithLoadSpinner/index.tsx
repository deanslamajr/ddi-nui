import { LinksFunction } from "remix";
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

// const PercentageCompleteText = styled.span`
//   position: absolute;
//   top: 20%;
//   z-index: 999;
//   font-size: 4rem;
//   font-weight: bold;
//   color: ${theme.colors.white};
//   opacity: .8;
//   cursor: default;
//   user-select: none;
// `

const LoadSpinner: React.FC<{}> = ({}) => {
  return (
    <span className="load-spinner-container">
      <div className="load-spinner" style={spinnerUrlAsCssVariable}>
        {/* {Number.isInteger(percentCompleted) && <PercentageCompleteText>{percentCompleted}&#37;</PercentageCompleteText>} */}
      </div>
    </span>
  );
};

export default LoadSpinner;
