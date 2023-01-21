import React from "react";
import { Rect, Text } from "react-konva";

import { EmojiConfigSerialized, EmojiRef } from "~/models/emojiConfig";

import {
  getKonvaConfigFromEmojiConfig,
  getOffsetsFromTextRef,
} from "~/utils/konva";

const KonvaEmoji: React.FC<{
  emojiConfig: EmojiConfigSerialized;
  useOutline?: boolean;
}> = ({ emojiConfig, useOutline = false }) => {
  const isInitialRender = React.useRef(true);
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

  React.useEffect(() => {
    if (nonRotatingEmojiCacheRef.current && emojiCacheRef.current) {
      const { offsetX, offsetY } = getOffsetsFromTextRef(
        nonRotatingEmojiCacheRef.current
      );
      const boundingRect = nonRotatingEmojiCacheRef.current?.getClientRect();

      if (isInitialRender.current) {
        boundingRect.x -= offsetX;
        boundingRect.y -= offsetY;
        isInitialRender.current = false;
      }

      setStuff({
        offsetX,
        offsetY,
        boundingRect,
      });

      const cacheConfig = {
        offset: 100,
        pixelRatio: 2, /// fixes android graphics glitch
        imageSmoothingEnabled: true,
      };

      emojiCacheRef.current.cache(cacheConfig);
    }
  }, [emojiConfig, setStuff]);

  return (
    <>
      {useOutline && stuff && (
        <Rect
          width={stuff.boundingRect.width}
          height={stuff.boundingRect.height}
          x={stuff.boundingRect.x}
          y={stuff.boundingRect.y}
          stroke="red"
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
