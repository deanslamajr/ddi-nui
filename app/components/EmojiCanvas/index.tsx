import { FC, useEffect, useMemo, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Stage, Layer, Rect, Group } from "react-konva";
import Konva from "konva";

import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { theme } from "~/utils/stylesTheme";
import sortEmojis from "~/utils/sortEmoijs";
import { DEFAULT_STUDIO_STATE } from "~/utils/validators";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import { getSelectedEmojiIds } from "~/contexts/ComicStudioState/selectors";
import KonvaEmoji from "~/components/KonvaEmoji";

import stylesUrl from "~/styles/components/EmojiCanvas.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const getSortedEmojisArray = (
  emojisRecord: Record<string, EmojiConfigSerialized> | EmojiConfigSerialized[]
): EmojiConfigSerialized[] => {
  const emojisArray = Array.isArray(emojisRecord)
    ? emojisRecord
    : Object.values(emojisRecord);
  return sortEmojis(emojisArray);
};

type MainProps = {
  activeEmojiId?: number | null;
  backgroundColor?: string | null;
  emojiConfigs: Record<string, EmojiConfigSerialized> | EmojiConfigSerialized[];
  cellUrlId: string;
};

type PropsWithDragging = MainProps & {
  handleDragEnd: (args: { xDiff: number; yDiff: number }) => void;
  isDraggable: true;
};

type PropsWithoutDragging = MainProps & {
  isDraggable: false;
};

const EmojiCanvas: FC<PropsWithDragging | PropsWithoutDragging> = (props) => {
  const {
    activeEmojiId,
    backgroundColor,
    emojiConfigs,
    isDraggable,
    cellUrlId,
  } = props;

  const [comicStudioState] = useComicStudioState();
  const selectedEmojiIds = getSelectedEmojiIds(comicStudioState, cellUrlId);

  const [localEmojiConfigs, setLocalEmojiConfigs] = useState<
    EmojiConfigSerialized[]
  >(() => {
    return getSortedEmojisArray(emojiConfigs);
  });

  useEffect(() => {
    const newLocalEmojiConfigs = getSortedEmojisArray(emojiConfigs);
    setLocalEmojiConfigs(newLocalEmojiConfigs);
  }, [emojiConfigs]);

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
    if (isDraggable) {
      setState((prevState) => ({ ...prevState, isDragging: true }));
    }
  };

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (isDraggable) {
      const { x, y } = e.target.attrs;
      const { prevX, prevY } = state;

      const xDiff = x - prevX;
      const yDiff = y - prevY;

      props.handleDragEnd({ xDiff, yDiff });

      // we need a change to force a rerender of Group (to reset the position of draggable group)
      const groupXChange = xDiff > 0 ? 0.01 : -0.01;
      const groupYChange = yDiff > 0 ? 0.01 : -0.01;

      setState((prevState) => ({
        isDragging: false,
        prevX: prevState.prevX + groupXChange,
        prevY: prevState.prevY + groupYChange,
      }));
    }
  };

  // const activeEmojiConfig =
  //   localEmojiConfigs.find((config) => config.id === activeEmojiId) || null;

  // const outlineConfig = useMemo(() => {
  //   if (
  //     typeof activeEmojiConfig?.x !== "number" ||
  //     typeof activeEmojiConfig?.y !== "number" ||
  //     typeof activeEmojiConfig?.scaleX !== "number" ||
  //     typeof activeEmojiConfig?.scaleY !== "number" ||
  //     typeof activeEmojiConfig?.rotation !== "number" ||
  //     typeof activeEmojiConfig?.size !== "number"
  //   ) {
  //     return null;
  //   }

  //   return {
  //     x: activeEmojiConfig.x,
  //     y: activeEmojiConfig.y,
  //     scaleX: activeEmojiConfig.scaleX,
  //     scaleY: activeEmojiConfig.scaleY,
  //     rotation: activeEmojiConfig.rotation,
  //     emoji: "    ",
  //     size: activeEmojiConfig.size,
  //   } as EmojiConfigSerialized;
  // }, [
  //   activeEmojiConfig?.x,
  //   activeEmojiConfig?.y,
  //   activeEmojiConfig?.scaleX,
  //   activeEmojiConfig?.scaleY,
  //   activeEmojiConfig?.rotation,
  //   activeEmojiConfig?.size,
  // ]);
  const activeEmojisConfigs = useMemo(() => {
    return (
      localEmojiConfigs.filter((config) => config.id === activeEmojiId) || null
    );
  }, localEmojiConfigs);

  const outlineConfigs: EmojiConfigSerialized[] = useMemo(() => {
    return (activeEmojisConfigs || [])
      .filter((activeEmojisConfig) => {
        if (
          typeof activeEmojisConfig?.x !== "number" ||
          typeof activeEmojisConfig?.y !== "number" ||
          typeof activeEmojisConfig?.scaleX !== "number" ||
          typeof activeEmojisConfig?.scaleY !== "number" ||
          typeof activeEmojisConfig?.rotation !== "number" ||
          typeof activeEmojisConfig?.size !== "number"
        ) {
          return false;
        } else {
          return true;
        }
      })
      .map((activeEmojisConfig) => {
        return {
          x: activeEmojisConfig.x,
          y: activeEmojisConfig.y,
          scaleX: activeEmojisConfig.scaleX,
          scaleY: activeEmojisConfig.scaleY,
          rotation: activeEmojisConfig.rotation,
          emoji: "    ",
          size: activeEmojisConfig.size,
        } as EmojiConfigSerialized;
      });
  }, [activeEmojisConfigs]);

  // const modifiedActiveEmojiConfig = useMemo(() => {
  //   return activeEmojisConfigs
  //     ? {
  //         ...activeEmojisConfigs,
  //         opacity: 0.25,
  //       }
  //     : null;
  // }, [activeEmojisConfigs]);
  const modifiedActiveEmojiConfigs = useMemo(() => {
    if (state.isDragging) {
      return activeEmojisConfigs
        .filter((activeEmojisConfig) => Boolean(activeEmojisConfig))
        .map((activeEmojisConfig) => {
          return {
            ...activeEmojisConfig,
            opacity: 0.25,
          };
        });
    } else {
      return [];
    }
  }, [activeEmojisConfigs, state.isDragging]);

  return (
    <div className="emoji-canvas">
      <Stage width={theme.canvas.width} height={theme.canvas.height}>
        <Layer listening={false}>
          {/* Canvas */}
          {/* 1st layer is the default color */}
          <Rect
            x={0}
            y={0}
            width={theme.canvas.width}
            height={theme.canvas.height}
            fill={DEFAULT_STUDIO_STATE.backgroundColor}
          />
          {/* 2nd layer is the color user can set */}
          {/* this color can include transparency */}
          {backgroundColor && (
            <Rect
              x={0}
              y={0}
              width={theme.canvas.width}
              height={theme.canvas.height}
              fill={backgroundColor}
            />
          )}

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

          {localEmojiConfigs.map((config) => (
            <KonvaEmoji
              useCache
              emojiConfig={config}
              key={`${config.id}${config.emoji}`}
            />
          ))}

          {/* {outlineConfig && (
            <KonvaEmoji
              key="active-emoji-outline"
              emojiConfig={outlineConfig}
              useOutline
            />
          )} */}

          {outlineConfigs.map((outlineConfig) => (
            <KonvaEmoji
              key={`active-emoji-outline-${outlineConfig.id}`}
              emojiConfig={outlineConfig}
              useOutline
            />
          ))}
        </Layer>
        {/* Draggable layer */}
        <Layer listening={isDraggable}>
          <Group
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            x={state.prevX}
            y={state.prevX}
          >
            {/* "Glass pane" */}
            <Rect
              width={theme.canvas.width}
              height={theme.canvas.height}
              x={state.prevX}
              y={state.prevX}
            />
            {/* {modifiedActiveEmojiConfig && state.isDragging && (
              <KonvaEmoji
                useCache
                key="active-emoji-ghost"
                emojiConfig={modifiedActiveEmojiConfig}
              />
            )} */}
            {modifiedActiveEmojiConfigs.map((modifiedActiveEmojiConfig) => (
              <KonvaEmoji
                useCache
                key="active-emoji-ghost"
                emojiConfig={modifiedActiveEmojiConfig}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default EmojiCanvas;
