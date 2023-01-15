import React from "react";
import { Text } from "react-konva";

import { theme } from "~/utils/stylesTheme";
import {
  EmojiConfigJs,
  EmojiConfigSerialized,
  EmojiRef,
} from "~/models/emojiConfig";

import { getKonvaConfigFromEmojiConfig } from "~/utils/konva";

const KonvaEmoji: React.FC<{ emojiConfig: EmojiConfigSerialized }> = ({
  emojiConfig,
}) => {
  const emojiCacheRef = React.useRef<EmojiRef>(null);
  const [konvaEncodedConfig, setKonvaEncodedConfig] =
    React.useState<EmojiConfigJs>({} as EmojiConfigJs);

  React.useEffect(() => {
    if (emojiCacheRef.current) {
      const konvaConfig = getKonvaConfigFromEmojiConfig(
        emojiConfig,
        emojiCacheRef.current
      );

      // emojiCacheRef.current.cache({
      //   // offset: 100,
      //   x: konvaConfig.offsetX - emojiCacheRef.current.getAbsolutePosition().x,
      //   y: konvaConfig.offsetY - emojiCacheRef.current.getAbsolutePosition().y,
      //   pixelRatio: 2, /// fixes android graphics glitch
      //   // drawBorder: true, /// set 'true' for debugging image drawing
      //   width: theme.canvas.width,
      //   height: theme.canvas.height,
      // });

      setKonvaEncodedConfig(konvaConfig);
    }
  }, [emojiConfig, emojiCacheRef.current]);

  return (
    <Text
      {...konvaEncodedConfig}
      useCache
      ref={emojiCacheRef}
      id={`${emojiConfig.id}`}
    />
  );
};

export default KonvaEmoji;
