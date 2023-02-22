import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import { RxDragHandleHorizontal } from "react-icons/rx";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import classNames from "classnames";
import deepClone from "fast-clone";

import { theme } from "~/utils/stylesTheme";
import sortEmojis from "~/utils/sortEmoijs";
import { EmojiConfigSerialized } from "~/models/emojiConfig";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  getActiveEmojiId,
  getCellStudioState,
} from "~/contexts/ComicStudioState/selectors";
import {
  setActiveEmoji,
  updateEmojisOrder,
} from "~/contexts/ComicStudioState/actions";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiIconStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const DraggableEmoji: React.FC<{
  dragDropId: string;
  activeEmojiId: number | null;
  emoji: EmojiConfigSerialized;
  onActiveEmojiSelect: (clickedEmojiId: number) => void;
}> = ({ activeEmojiId, dragDropId, emoji, onActiveEmojiSelect }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dragDropId,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
  } = useDraggable({
    id: dragDropId,
  });

  const isActive = emoji.id === activeEmojiId;

  return (
    <div ref={setNodeRef}>
      <div ref={setDraggableNodeRef} {...attributes}>
        <MenuButton
          noSpinner
          className={classNames("cell-studio-menu-button emoji-menu-button", {
            ["draggable-is-over-droppable"]: isOver,
          })}
        >
          <span
            onClick={(event) => {
              // event.stopPropagation();
              console.log("circle clicked");
            }}
            className={classNames("quarter-button", "selector", {
              active: isActive,
            })}
          >
            {isActive ? (
              <RiCheckboxCircleFill color={theme.colors.pink} />
            ) : (
              <RiCheckboxBlankCircleLine />
            )}
          </span>
          <EmojiIcon
            withHandles
            config={emoji}
            onClick={() => {
              if (!isActive) {
                onActiveEmojiSelect(emoji.id);
              }
            }}
          />
          <span className="quarter-button handle" {...listeners}>
            <RxDragHandleHorizontal color={theme.colors.lightBlack} />
          </span>
        </MenuButton>
      </div>
    </div>
  );
};

const EmojiMenu: React.FC<{}> = ({}) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [emojiBeingDragged, setEmojiBeingDragged] =
    React.useState<EmojiConfigSerialized | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // detection of touch intent requires
    // long-press equal or greater than 50ms,
    // during which no more than 5px of movement of the long-press gesture
    activationConstraint: {
      delay: 50,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // todo: move this logic to the reducer layer
  const changeEmojiOrder = (activeEmojiId: number, overEmojiId: number) => {
    const activeEmojiConfig = cellStudioState?.emojis[activeEmojiId];
    const overEmojiConfig = cellStudioState?.emojis[overEmojiId];

    if (!activeEmojiConfig || !overEmojiConfig) {
      return;
    }

    const clonedEmojiConfigs = deepClone(cellStudioState?.emojis);
    const clonedActiveEmojiConfig = clonedEmojiConfigs[activeEmojiId];

    // make dragged emoji lower
    if (activeEmojiConfig.order > overEmojiConfig.order) {
      // all emojis with (order >= dropped.order && order < dragged.order) increase order by 1
      Object.values(clonedEmojiConfigs).forEach((e) => {
        if (
          e.order >= overEmojiConfig.order &&
          e.order < activeEmojiConfig.order
        ) {
          e.order = e.order + 1;
        }
      });
    } else {
      // all emojis with (order <= dropped.order && order > dragged.order) decrease order by 1
      Object.values(clonedEmojiConfigs).forEach((e) => {
        if (
          e.order <= overEmojiConfig.order &&
          e.order > activeEmojiConfig.order
        ) {
          e.order = e.order - 1;
        }
      });
    }
    clonedActiveEmojiConfig!.order = overEmojiConfig.order;

    dispatch(
      updateEmojisOrder({
        cellUrlId,
        reorderedEmojis: clonedEmojiConfigs,
      })
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEmoji = cellStudioState?.emojis[event.active.id.toString()];
    if (draggedEmoji) {
      setEmojiBeingDragged(draggedEmoji);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setEmojiBeingDragged(null);
    if (
      event.active.id &&
      event.over?.id &&
      event.active.id !== event.over.id
    ) {
      changeEmojiOrder(
        parseInt(event.active.id as string),
        parseInt(event.over.id as string)
      );
    }
  };

  const updateActiveEmoji = (newActiveEmojiId: number) => {
    dispatch(
      setActiveEmoji({
        cellUrlId,
        newActiveEmojiId,
      })
    );
  };

  const sortedEmojiArray = React.useMemo(() => {
    if (!cellStudioState) {
      return [];
    }
    const unsortedEmojis = Object.values(cellStudioState.emojis);
    return sortEmojis(unsortedEmojis, true);
  }, [cellStudioState]);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      >
        <div className="scroll-container">
          {sortedEmojiArray.map((emoji) => (
            <DraggableEmoji
              activeEmojiId={activeEmojiId}
              emoji={emoji}
              key={`${emoji.emoji}-${emoji.id}-droppable`}
              dragDropId={emoji.id.toString()}
              onActiveEmojiSelect={updateActiveEmoji}
            />
          ))}
        </div>
        <DragOverlay>
          {emojiBeingDragged && (
            <MenuButton
              key={`${emojiBeingDragged.emoji}-${emojiBeingDragged.id}`}
              isSecondary={emojiBeingDragged.id === activeEmojiId}
              className="cell-studio-menu-button emoji-menu-button drag-overlay"
            >
              <span className="quarter-button" />
              <EmojiIcon config={emojiBeingDragged} withHandles />
              <span className="quarter-button handle">
                <RxDragHandleHorizontal color={theme.colors.lightBlack} />
              </span>
            </MenuButton>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default EmojiMenu;
