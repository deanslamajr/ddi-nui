import { FC, useMemo, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Stage, Layer, Rect, Group } from "react-konva";
import Konva from "konva";

import { EmojiConfigSerialized, EmojiRefs } from "~/models/emojiConfig";
import { theme } from "~/utils/stylesTheme";

import KonvaEmoji from "~/components/KonvaEmoji";

import stylesUrl from "~/styles/components/EmojiCanvas.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const EmojiCanvas: FC<{
  activeEmojiId: number;
  backgroundColor: string;
  emojiConfigs: EmojiConfigSerialized[];
  handleDragEnd: (args: { xDiff: number; yDiff: number }) => void;
}> = ({ activeEmojiId, backgroundColor, emojiConfigs, handleDragEnd }) => {
  const [state, setState] = useState<{
    isDragging: boolean;
    prevX: number;
    prevY: number;
  }>({
    isDragging: false,
    prevX: 0,
    prevY: 0,
  });

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

  const activeEmojiConfig =
    emojiConfigs.find((config) => config.id === activeEmojiId) ||
    ({} as EmojiConfigSerialized);

  const outlineConfig = useMemo(() => {
    const getOutlineConfig = (
      config: EmojiConfigSerialized
    ): EmojiConfigSerialized => {
      const { x, y, scaleX, scaleY, rotation, size } = config;

      return {
        x,
        y,
        scaleX,
        scaleY,
        rotation,
        emoji: "    ",
        size,
        filters: [Konva.Filters.RGBA],
        alpha: 1,
        red: 255,
        green: 76,
        blue: 127,
      } as EmojiConfigSerialized;
    };
    const config = getOutlineConfig(activeEmojiConfig);
    config.opacity = state.isDragging ? 0 : 0.5;
    return config;
  }, [activeEmojiConfig, state.isDragging]);

  const modifiedActiveEmojiConfig = useMemo(() => {
    return {
      ...activeEmojiConfig,
      opacity: state.isDragging ? 0.25 : 0,
    };
  }, [activeEmojiConfig, state.isDragging]);

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

          {emojiConfigs.map((config) => (
            <KonvaEmoji
              emojiConfig={config}
              key={`${config.id}${config.emoji}`}
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
            <KonvaEmoji emojiConfig={modifiedActiveEmojiConfig} />
            <KonvaEmoji emojiConfig={outlineConfig} />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default EmojiCanvas;
