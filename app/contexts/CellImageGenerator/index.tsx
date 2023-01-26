import React from "react";
import hash from "hash-it";

import { StudioStateImageData } from "~/interfaces/studioState";
import { generateCellImage as generateCellImageFromEmojis } from "./generateCellImageFromEmojis";

type CacheItem = {
  isLoading: boolean;
  imageUrl: string | null;
};
export type GeneratedCellImageContext =
  | {
      getCellCache: (
        studioStateImageData: StudioStateImageData
      ) => CacheItem | null;
      generateCellImage: (
        studioStateImageData: StudioStateImageData
      ) => Promise<void>;
    }
  | undefined;

const Context = React.createContext<GeneratedCellImageContext>(undefined);

const CellImageProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [cache, setCache] = React.useState<Record<string, CacheItem>>({});

  const contextValue = React.useMemo(() => {
    const getCellCache = (studioStateImageData: StudioStateImageData) => {
      // generate cache key
      const cacheKey = hash(studioStateImageData);
      return cache[cacheKey] || null;
    };

    const generateCellImage = async (
      studioStateImageData: StudioStateImageData
    ) => {
      const cacheKey = hash(studioStateImageData);
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: {
          isLoading: true,
          imageUrl: null,
        },
      }));

      // generate new image
      const cellGenerationResponse = await generateCellImageFromEmojis(
        studioStateImageData,
        cacheKey
      );

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

const useCellImage = (
  cellStudioStateImageData: StudioStateImageData | null
): CacheItem => {
  const [state, setState] = React.useState<CacheItem>({
    imageUrl: null,
    isLoading: false,
  });

  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useCellImage must be used within a CellImageProvider");
  }

  React.useEffect(() => {
    if (cellStudioStateImageData) {
      // check for cache hit
      const cacheHit = context.getCellCache(cellStudioStateImageData);
      if (cacheHit) {
        setState(cacheHit);
      } else {
        context.generateCellImage(cellStudioStateImageData);
      }
    }
  }, [cellStudioStateImageData, context]);

  return state;
};

export { CellImageProvider, useCellImage as useCellImageGenerator };
