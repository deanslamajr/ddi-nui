import React from "react";
import type { LinksFunction } from "@remix-run/node";
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
import { TbReplace } from "react-icons/tb";
import { BiDuplicate } from "react-icons/bi";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import classNames from "classnames";

import { theme } from "~/utils/stylesTheme";
import sortEmojis from "~/utils/sortEmoijs";
import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiIconStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const Droppable: React.FC<{
  dragDropId: string;
  activeEmojiId: number;
  emoji: EmojiConfigSerialized;
}> = ({ activeEmojiId, dragDropId, emoji }) => {
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

  const className = isOver
    ? "cell-studio-menu-button emoji-menu-button draggable-is-over-droppable"
    : "cell-studio-menu-button emoji-menu-button";

  const isActive = emoji.id === activeEmojiId;

  return (
    <div ref={setNodeRef}>
      <div ref={setDraggableNodeRef} {...attributes}>
        <MenuButton noSpinner className={className}>
          <span
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
          <EmojiIcon config={emoji} withHandles />
          <span className="quarter-button handle" {...listeners}>
            <RxDragHandleHorizontal color={theme.colors.lightBlack} />
          </span>
        </MenuButton>
      </div>
    </div>
  );
};

const EmojiMenu: React.FC<{
  activeEmojiId: number;
  emojiConfigs: Record<string, EmojiConfigSerialized>;
  onBackButtonClick: () => void;
}> = ({ activeEmojiId, emojiConfigs, onBackButtonClick }) => {
  const [state, setState] = React.useState<{
    localEmojiConfigs: EmojiConfigSerialized[];
  }>(() => {
    const localEmojiConfigs = emojiConfigs ? Object.values(emojiConfigs) : [];
    const sortedEmojiConfigs = sortEmojis(localEmojiConfigs, true);
    return {
      localEmojiConfigs: sortedEmojiConfigs,
    };
  });
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

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEmoji = state.localEmojiConfigs.find(
      (e) => e.id.toString() === event.active.id.toString()
    );
    if (draggedEmoji) {
      setEmojiBeingDragged(draggedEmoji);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setEmojiBeingDragged(null);
  };

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      <div className="button-row">
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={() => console.log("clicked!")}
        >
          <TbReplace />
        </MenuButton>
        <MenuButton
          className="cell-studio-menu-button half-width"
          onClick={() => console.log("clicked!")}
        >
          <BiDuplicate />
        </MenuButton>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      >
        <div className="scroll-container">
          {state.localEmojiConfigs.map((emoji) => (
            <Droppable
              activeEmojiId={activeEmojiId}
              emoji={emoji}
              key={`${emoji.emoji}-${emoji.id}-droppable`}
              dragDropId={emoji.id.toString()}
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
