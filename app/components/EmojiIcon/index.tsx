import React from "react";
import { Layer, Stage, Text } from "react-konva";
import classNames from "classnames";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import KonvaEmoji from "~/components/KonvaEmoji";

import type { LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/components/EmojiIcon.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const STAGE_WIDTH = 125;

export const EmojiIcon: React.FC<{
  config: EmojiConfigSerialized;
  withHandles?: boolean;
}> = ({ config, withHandles }) => {
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
      x: STAGE_WIDTH / 2,
      y: stageDimensions.height / 2,
      size: 166,
      scaleX: config.scaleX < 0 ? -0.17 : 0.17, // icon should represent result of emoji flip action
      scaleY: config.scaleY < 0 ? -0.17 : 0.17, // icon should represent result of emoji flip action
    };
  }, [config, stageDimensions]);

  return (
    <span
      className={classNames("emoji-icon-container", {
        "with-handles": withHandles,
      })}
      ref={emojiIconRef}
    >
      {stageDimensions && emojiConfig && (
        // <Stage width={STAGE_WIDTH} height={stageDimensions.height}>
        //   <Layer>
        //     <KonvaEmoji emojiConfig={emojiConfig} />
        //   </Layer>
        // </Stage>
        <div>{emojiConfig.emoji}</div>
      )}
    </span>
  );
};
