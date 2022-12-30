import React from "react";
import { useNavigate } from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";

import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";
import useHydrateComic from "~/hooks/useHydrateComic";
import { DDI_APP_PAGES } from "~/utils/urls";
import { HydratedComic } from "~/utils/clientCache";

import { ComicStudioContextValue } from "./types";
import { reducer, initialState } from "./reducer";

export const links: LinksFunction = () => {
  return [...cellWithLoadSpinnerStylesUrl()];
};

const StudioStateContext =
  React.createContext<ComicStudioContextValue>(undefined);

const Provider: React.FC<
  React.PropsWithChildren<{ hydratedComic: HydratedComic }>
> = ({ children, hydratedComic }) => {
  const returnFromUseReducer = React.useReducer(reducer, {
    changeHistory: initialState.changeHistory,
    comicState: hydratedComic,
  });

  return (
    <StudioStateContext.Provider value={returnFromUseReducer}>
      {children}
    </StudioStateContext.Provider>
  );
};

const ComicStudioStateProvider: React.FC<
  React.PropsWithChildren<{
    comicUrlId: string;
  }>
> = ({ children, comicUrlId }) => {
  const navigate = useNavigate();
  const { comic: hydratedComic, isHydrating: isHydratingComic } =
    useHydrateComic({
      comicUrlId,
      onError: () => {
        navigate(DDI_APP_PAGES.gallery(), { replace: true });
      },
    });

  React.useEffect(() => {
    // If attempt to hydrate comic completes without any comic data, redirect to gallery
    // e.g. incorrect comicUrlId, draft comic doesn't exist in client cache, corrupted client cache
    if (!hydratedComic && !isHydratingComic) {
      navigate(DDI_APP_PAGES.gallery(), { replace: true });
    }
  }, [hydratedComic, isHydratingComic]);

  return isHydratingComic || !hydratedComic ? (
    <CellWithLoadSpinner />
  ) : (
    <Provider hydratedComic={hydratedComic}>{children}</Provider>
  );
};

function useComicStudioState() {
  const context = React.useContext(StudioStateContext);
  if (context === undefined) {
    throw new Error(
      "useComicStudioState must be used within a ComicStudioStateProvider"
    );
  }
  return context;
}

export { ComicStudioStateProvider, useComicStudioState };
