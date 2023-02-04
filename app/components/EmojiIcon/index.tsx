import React from "react";
import classNames from "classnames";
import type { LinksFunction } from "@remix-run/node";

import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { useCellImageGenerator } from "~/contexts/CellImageGenerator";
import { StudioStateImageData } from "~/interfaces/studioState";
import { theme } from "~/utils/stylesTheme";

import stylesUrl from "~/styles/components/EmojiIcon.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const EmojiIcon: React.FC<{
  config: EmojiConfigSerialized;
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  withHandles?: boolean;
}> = ({ config, onClick, withHandles }) => {
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

  const emojiConfig: StudioStateImageData | null = React.useMemo(() => {
    if (!stageDimensions) {
      return null;
    }

    return {
      emojis: {
        [config.id]: {
          ...config,
          id: 1,
          x: theme.canvas.width / 2,
          y: theme.canvas.height / 2,
          size: theme.canvas.height / 2,
          scaleX: config.scaleX < 0 ? -1 : 1, // icon should represent result of emoji flip action
          scaleY: config.scaleY < 0 ? -1 : 1, // icon should represent result of emoji flip action
        },
      },
      backgroundColor: null,
    };
  }, [config, stageDimensions]);

  const { imageUrl } = useCellImageGenerator(emojiConfig);

  return (
    <span
      className={classNames("emoji-icon-container", {
        "with-handles": withHandles,
      })}
      onClick={(event) => onClick && onClick(event)}
      ref={emojiIconRef}
    >
      {stageDimensions && emojiConfig && imageUrl && (
        <img className="emoji-icon-image" src={imageUrl} />
      )}
    </span>
  );
};
