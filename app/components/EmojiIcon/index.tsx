import React from "react";
import { Layer, Stage, Text } from "react-konva";

import { EmojiRefs } from "../EmojiCanvas";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { getEmojiConfig } from "~/utils/konva";

export const EmojiIcon: React.FC<{
  config: EmojiConfigSerialized;
  emojiRefs?: EmojiRefs;
}> = ({ config, emojiRefs }) => {
  const emojiKonvaConfig = getEmojiConfig(config);

  const textConfig = {
    ...emojiKonvaConfig,
    x: 0,
    y: 5,
    fontSize: 166,
    scaleX: 0.17,
    scaleY: 0.17,
    useCache: true,
  };

  console.log("textConfig", textConfig);

  return (
    <div className="emoji-canvas">
      <Stage width={35} height={35}>
        <Layer>
          <Text
            {...textConfig}

            // ref={(ref) => (emojiRefs[emojiKonvaConfig["data-id"]] = ref)}
            // key={`${config["data-id"]}${config.text}`}
            // id={`${config["data-id"]}`}
          />
        </Layer>
      </Stage>
    </div>
  );
};
