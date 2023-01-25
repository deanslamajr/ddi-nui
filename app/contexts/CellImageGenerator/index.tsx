import React from "react";
import hash from "hash-it";

import { CellFromClientCache } from "~/utils/clientCache/cell";
import { generateCellImage as generateCellImageFromEmojis } from "./generateCellImageFromEmojis";

type CacheItem = {
  isLoading: boolean;
  imageUrl: string | null;
};
export type GeneratedCellImageContext =
  | {
      getCellCache: (cell: CellFromClientCache) => CacheItem | null;
      generateCellImage: (cell: CellFromClientCache) => Promise<void>;
    }
  | undefined;

const Context = React.createContext<GeneratedCellImageContext>(undefined);

const CellImageProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [cache, setCache] = React.useState<Record<string, CacheItem>>({});

  const contextValue = React.useMemo(() => {
    const getCellCache = (cell: CellFromClientCache) => {
      // generate cache key
      const cacheKey = hash(cell.studioState);
      return cache[cacheKey] || null;
    };

    const generateCellImage = async (cell: CellFromClientCache) => {
      const cacheKey = hash(cell.studioState);
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: {
          isLoading: true,
          imageUrl: null,
        },
      }));

      // generate new image
      const cellGenerationResponse = await generateCellImageFromEmojis(cell);

      // cache new image
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: {
          isLoading: false,
          imageUrl: cellGenerationResponse.url,
        },
      }));
    };

    return { getCellCache, generateCellImage };
  }, [cache]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

const useCellImage = (cell: CellFromClientCache | null): CacheItem => {
  const [state, setState] = React.useState<CacheItem>({
    imageUrl: null,
    isLoading: false,
  });

  const context = React.useContext(Context);
  console.log("context", context);
  if (context === undefined) {
    throw new Error("useCellImage must be used within a CellImageProvider");
  }

  React.useEffect(() => {
    if (cell) {
      // check for cache hit
      const cacheHit = context.getCellCache(cell);
      if (cacheHit) {
        setState(cacheHit);
      } else {
        context.generateCellImage(cell);
      }
    }
  }, [cell, context]);

  return state;
};

export { CellImageProvider, useCellImage as useCellImageGenerator };
