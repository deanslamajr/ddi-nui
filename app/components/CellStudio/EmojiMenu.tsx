import React from "react";
import type { LinksFunction } from "@remix-run/node";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";

import sortEmojis from "~/utils/sortEmoijs";
import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { EmojiIcon, links as emojiIconStylesUrl } from "~/components/EmojiIcon";
import Draggable from "~/components/Draggable";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...buttonStylesUrl(),
    ...emojiIconStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const Droppable: React.FC<{ dropId: string }> = ({ dropId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
  });

  return <span ref={setNodeRef} className="button"></span>;
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
    // long-press equal or greater than 50ms, during which no more than 5px of movement of the long-press gesture
    activationConstraint: {
      delay: 50,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    console.log("drag start", event);
    console.log("state.localEmojiConfigs", state.localEmojiConfigs);
    const draggedEmoji = state.localEmojiConfigs.find(
      (e) => e.id.toString() === event.active.id.toString()
    );
    console.log("draggedEmoji", draggedEmoji);
    if (draggedEmoji) {
      setEmojiBeingDragged(draggedEmoji);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("drag end", event);
    setEmojiBeingDragged(null);
  };

  return (
    <>
      <BackMenuButton onBackButtonClick={onBackButtonClick} />
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        CHANGE EMOJI
      </MenuButton>
      <MenuButton
        className="cell-studio-menu-button medium-font"
        onClick={() => console.log("clicked!")}
      >
        DUPLICATE EMOJI
      </MenuButton>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {state.localEmojiConfigs.map((emoji) => (
          <>
            <Droppable
              key={`${emoji.emoji}-${emoji.id}-droppable`}
              dropId={emoji.id.toString()}
            />
            <Draggable
              key={`${emoji.emoji}-${emoji.id}-draggable`}
              draggableId={emoji.id.toString()}
            >
              <MenuButton
                isSecondary={emoji.id === activeEmojiId}
                className="cell-studio-menu-button"
                // onClick={onEmojiButtonClick}
              >
                <EmojiIcon config={emoji} />
              </MenuButton>
            </Draggable>
          </>
        ))}
        <Droppable dropId={"bottom"} />
        <DragOverlay>
          {emojiBeingDragged && (
            <MenuButton
              key={`${emojiBeingDragged.emoji}-${emojiBeingDragged.id}`}
              isSecondary={emojiBeingDragged.id === activeEmojiId}
              className="cell-studio-menu-button"
            >
              <EmojiIcon config={emojiBeingDragged} />
            </MenuButton>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default EmojiMenu;
