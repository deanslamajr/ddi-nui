import React from "react";
import { Layer, Stage, Text } from "react-konva";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import KonvaEmoji from "~/components/KonvaEmoji";

import type { LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/components/EmojiIcon.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const EmojiIcon: React.FC<{
  config: EmojiConfigSerialized;
}> = ({ config }) => {
  const emojiIconRef = React.useRef<HTMLDivElement>(null);
  const [stageDimensions, setStageDimensions] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  React.useEffect(() => {
    if (emojiIconRef.current) {
      setStageDimensions({
        width: emojiIconRef.current.clientWidth,
        height: emojiIconRef.current.clientHeight,
      });
    }
  }, [emojiIconRef.current]);

  const emojiConfig: EmojiConfigSerialized | null = React.useMemo(() => {
    if (!stageDimensions) {
      return null;
    }

    return {
      ...config,
      id: 1,
      x: stageDimensions.width / 2,
      y: stageDimensions.height / 2,
      size: 166,
      scaleX: config.scaleX < 0 ? -0.17 : 0.17, // icon should represent result of emoji flip action
      scaleY: config.scaleY < 0 ? -0.17 : 0.17, // icon should represent result of emoji flip action
    };
  }, [config, stageDimensions]);

  return (
    <div className="emoji-icon-container" ref={emojiIconRef}>
      {stageDimensions && emojiConfig && (
        <Stage width={stageDimensions.width} height={stageDimensions.height}>
          <Layer>
            <KonvaEmoji emojiConfig={emojiConfig} />
          </Layer>
        </Stage>
      )}
    </div>
  );
};
