import { FC, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Stage, Layer, Rect, Text, Group } from "react-konva";
import Konva from "konva";

import { EmojiConfigSerialized, EmojiConfigJs } from "~/models/emojiConfig";
import { theme } from "~/utils/stylesTheme";

import {
  getEmojiConfigs,
  EMOJI_MASK_REF_ID,
  EMOJI_MASK_OUTLINE_REF_ID,
} from "~/utils/konva";

import stylesUrl from "~/styles/components/EmojiCanvas.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const getOutlineConfig = (config: EmojiConfigJs) => {
  const { x, y, scaleX, scaleY, rotation, fontSize, useCache } = config;

  return {
    x,
    y,
    scaleX,
    scaleY,
    rotation,
    text: "    ",
    fontSize,
    useCache,
  } as EmojiConfigJs;
};

export type EmojiRefs = Record<string, Konva.Text | null>;

const EmojiCanvas: FC<{
  activeEmojiId: number;
  backgroundColor: string;
  emojiConfigs: EmojiConfigSerialized[];
  emojiRefs: EmojiRefs;
  handleDragEnd: (args: { xDiff: number; yDiff: number }) => void;
}> = ({
  activeEmojiId,
  backgroundColor,
  emojiConfigs,
  emojiRefs,
  handleDragEnd,
}) => {
  const [state, setState] = useState<{
    isDragging: boolean;
    prevX: number;
    prevY: number;
  }>({
    isDragging: false,
    prevX: 0,
    prevY: 0,
  });

  const emojiKonvaConfigs = getEmojiConfigs(emojiConfigs);

  const onDragStart = () => {
    setState((prevState) => ({ ...prevState, isDragging: true }));
  };

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.attrs;
    const { prevX, prevY } = state;

    const xDiff = x - prevX;
    const yDiff = y - prevY;

    handleDragEnd({ xDiff, yDiff });

    // we need a change to force a rerender of Group (to reset the position of draggable group)
    const groupXChange = xDiff > 0 ? 0.01 : -0.01;
    const groupYChange = yDiff > 0 ? 0.01 : -0.01;

    setState((prevState) => ({
      isDragging: false,
      prevX: prevState.prevX + groupXChange,
      prevY: prevState.prevY + groupYChange,
    }));
  };

  if (emojiKonvaConfigs === null) {
    return null;
  }

  const activeEmojiConfig =
    emojiKonvaConfigs.find((config) => config["data-id"] === activeEmojiId) ||
    ({} as EmojiConfigJs);

  const outlineConfig = getOutlineConfig(activeEmojiConfig);

  // hide active emoji during drag action
  if (state.isDragging) {
    activeEmojiConfig!.opacity = 0;
    outlineConfig.opacity = 0;
  }

  console.dir(emojiKonvaConfigs);

  return (
    <div className="emoji-canvas">
      <Stage width={theme.canvas.width} height={theme.canvas.height}>
        <Layer>
          {/* Canvas */}
          <Rect
            x={0}
            y={0}
            width={theme.canvas.width}
            height={theme.canvas.height}
            fill={backgroundColor}
          />

          {/* /**
           * @todo step 3 generating emoji items as images
           * alternatively, try this approach https://github.com/konvajs/konva/issues/101#issuecomment-149646411
           */}
          {/* {this.state.emojiImageObj && <Image
              draggable
              rotation={0}
              width={1000}
              height={1000}
              x={0}
              y={0}
              image={this.state.emojiImageObj}
            />} */}

          {emojiKonvaConfigs.map((config) => (
            <Text
              {...config}
              useCache
              ref={(ref) => (emojiRefs[config["data-id"]] = ref)}
              key={`${config["data-id"]}${config.text}`}
              id={`${config["data-id"]}`}
            />
          ))}

          {/* Draggable layer */}
          <Group
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            x={state.prevX}
            y={state.prevX}
          >
            <Rect
              width={theme.canvas.width}
              height={theme.canvas.height}
              x={state.prevX}
              y={state.prevX}
            />
            <Text
              {...activeEmojiConfig}
              useCache
              ref={(ref) => (emojiRefs[EMOJI_MASK_REF_ID] = ref)}
              opacity={state.isDragging ? 0.25 : 0}
            />
            <Text
              {...outlineConfig}
              ref={(ref) => (emojiRefs[EMOJI_MASK_OUTLINE_REF_ID] = ref)}
              filters={[Konva.Filters.RGBA]}
              alpha={1}
              red={255}
              green={76}
              blue={127}
              opacity={0.5}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default EmojiCanvas;
