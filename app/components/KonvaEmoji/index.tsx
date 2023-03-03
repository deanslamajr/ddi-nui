import React from "react";
import { Rect, Text } from "react-konva";
import { useDebouncedCallback } from "use-debounce";

import { EmojiConfigSerialized, EmojiRef } from "~/models/emojiConfig";
import {
  getKonvaConfigFromEmojiConfig,
  getOffsetsFromTextRef,
} from "~/utils/konva";
import { theme } from "~/utils/stylesTheme";

const KonvaEmoji: React.FC<{
  emojiConfig: EmojiConfigSerialized;
  useOutline?: boolean;
  useCache?: boolean;
}> = ({ emojiConfig, useCache = false, useOutline = false }) => {
  const [isInitialRender, setIsInitialRender] = React.useState(true);
  const emojiCacheRef = React.useRef<EmojiRef>(null);
  const nonRotatingEmojiCacheRef = React.useRef<EmojiRef>(null);

  const [stuff, setStuff] = React.useState<{
    offsetX: number;
    offsetY: number;
    boundingRect: {
      width: number;
      height: number;
      x: number;
      y: number;
    };
  } | null>(null);
  const konvaConfig = getKonvaConfigFromEmojiConfig(
    emojiConfig,
    emojiCacheRef.current
  );

  const debouncedUpdateCache = useDebouncedCallback(
    // function
    (emojiCacheRef: React.MutableRefObject<EmojiRef>) => {
      console.log("about to cache");
      if (emojiCacheRef.current) {
        emojiCacheRef.current.cache({
          offset: 100,
          pixelRatio: 2,
          imageSmoothingEnabled: true,
        });
      }
    },
    // delay in ms
    10
  );

  const debouncedUpdateStuff = useDebouncedCallback(
    // function
    (emojiCacheRef: React.MutableRefObject<EmojiRef>) => {
      console.log("about to cache");
      if (emojiCacheRef.current) {
        emojiCacheRef.current.cache({
          offset: 100,
          pixelRatio: 2,
          imageSmoothingEnabled: true,
        });
      }
    },
    // delay in ms
    100
  );

  React.useEffect(() => {
    if (useCache) {
      debouncedUpdateCache(emojiCacheRef);
    }
  }, [emojiConfig, useCache]);

  React.useEffect(() => {
    if (nonRotatingEmojiCacheRef.current) {
      const { offsetX, offsetY } = getOffsetsFromTextRef(
        nonRotatingEmojiCacheRef.current
      );
      const boundingRect = {
        ...nonRotatingEmojiCacheRef.current.getClientRect(),
      };

      if (isInitialRender) {
        boundingRect.x -= offsetX;
        boundingRect.y -= offsetY;
        setStuff({
          offsetX,
          offsetY,
          boundingRect,
        });
        setIsInitialRender(false);
      } else {
        setStuff({
          offsetX,
          offsetY,
          boundingRect,
        });
      }
    }
  }, [emojiConfig, setStuff]);

  return (
    <>
      {useOutline && stuff && !isInitialRender && (
        <Rect
          width={Math.max(
            Math.min(stuff.boundingRect.width, 0.75 * theme.canvas.width),
            25
          )}
          height={Math.max(
            Math.min(stuff.boundingRect.height, 0.75 * theme.canvas.height),
            25
          )}
          x={stuff.boundingRect.x}
          y={stuff.boundingRect.y}
          stroke="red"
          opacity={0.5}
        />
      )}
      <Text
        {...konvaConfig}
        offsetX={stuff?.offsetX || 0}
        offsetY={stuff?.offsetY || 0}
        rotation={0}
        opacity={0}
        ref={nonRotatingEmojiCacheRef}
      />
      <Text
        {...konvaConfig}
        offsetX={stuff?.offsetX || 0}
        offsetY={stuff?.offsetY || 0}
        ref={emojiCacheRef}
        id={`${emojiConfig.id}`}
      />
    </>
  );
};

export default KonvaEmoji;
