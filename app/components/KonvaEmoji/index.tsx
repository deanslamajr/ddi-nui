import React from "react";
import { Rect, Text } from "react-konva";

import { EmojiConfigSerialized, EmojiRef } from "~/models/emojiConfig";
import { CellFromClientCache } from "~/utils/clientCache/cell";
import {
  getKonvaConfigFromEmojiConfig,
  getOffsetsFromTextRef,
  PIXEL_RATIO,
} from "~/utils/konva";
import { theme } from "~/utils/stylesTheme";

const KonvaEmoji: React.FC<{
  emojiConfig: EmojiConfigSerialized;
  schemaVersion: CellFromClientCache["schemaVersion"];
  useOutline?: boolean;
  useCache?: boolean;
}> = ({ emojiConfig, useCache = false, useOutline = false, schemaVersion }) => {
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

  React.useEffect(() => {
    if (useCache && emojiCacheRef.current) {
      emojiCacheRef.current.cache({
        offset: 100,
        pixelRatio: PIXEL_RATIO,
        // imageSmoothingEnabled: true,
      });
    }
  }, [emojiConfig, useCache]);

  React.useEffect(() => {
    if (nonRotatingEmojiCacheRef.current) {
      const { offsetX, offsetY } = getOffsetsFromTextRef(
        nonRotatingEmojiCacheRef.current
      );
      const boundingRect = nonRotatingEmojiCacheRef.current?.getClientRect();

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
  }, [emojiConfig, setStuff, isInitialRender]);

  const offsetX =
    typeof schemaVersion === "number" && schemaVersion >= 5
      ? stuff?.offsetX || 0
      : 0;
  const offsetY =
    typeof schemaVersion === "number" && schemaVersion >= 5
      ? stuff?.offsetY || 0
      : 0;

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
        // @TODO - what is the effect of commenting out? Does not seem to have an effect on >= v5 cells
        // comment out for < v5
        offsetX={offsetX}
        offsetY={offsetY}
        rotation={0}
        opacity={0}
        ref={nonRotatingEmojiCacheRef}
      />
      <Text
        {...konvaConfig}
        // @TODO - what is the effect of commenting out? Does not seem to have an effect on >= v5 cells
        // comment out for < v5
        offsetX={offsetX}
        offsetY={offsetY}
        ref={emojiCacheRef}
        id={`${emojiConfig.id}`}
      />
    </>
  );
};

export default KonvaEmoji;
