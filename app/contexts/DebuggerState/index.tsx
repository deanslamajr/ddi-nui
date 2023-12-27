import React from "react";
import { useSearchParams } from "@remix-run/react";
import { SEARCH_PARAMS } from "~/utils/constants";

export type State = {
  isDebugProdCell: boolean;
};

const DebuggerStateContext = React.createContext<State>({
  isDebugProdCell: false,
});

const DebuggerStateProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, setState] = React.useState<State>({
    isDebugProdCell: false,
  });

  const [searchParams] = useSearchParams();
  const isDebugProdCell = getIsDebugProdCell(searchParams);

  // Run this once when the app initializes
  // on client.
  React.useEffect(() => {
    if (isDebugProdCell) {
      setState({
        isDebugProdCell: true,
      });
    }
  }, []);

  return (
    <DebuggerStateContext.Provider value={state}>
      {children}
    </DebuggerStateContext.Provider>
  );
};

function useDebuggerState() {
  const context = React.useContext(DebuggerStateContext);
  if (context === undefined) {
    throw new Error(
      "useDebuggerState must be used within a DebuggerStateProvider"
    );
  }
  return context;
}

function getIsDebugProdCell(searchParams: URLSearchParams) {
  return Boolean(searchParams.getAll(SEARCH_PARAMS.DEBUG_PROD_CELL).length);
}

export { DebuggerStateProvider, useDebuggerState, getIsDebugProdCell };
