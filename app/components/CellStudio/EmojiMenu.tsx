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
import { TbReplace } from "react-icons/tb";
import { BiDuplicate } from "react-icons/bi";
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
import { updateEmojisOrder } from "~/contexts/ComicStudioState/actions";
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
  activeEmojiId: number | null;
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
  onBackButtonClick: () => void;
}> = ({ onBackButtonClick }) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellStudioState = getCellStudioState(comicStudioState, cellUrlId);
  const activeEmojiId = getActiveEmojiId(comicStudioState, cellUrlId);

  const [state, setState] = React.useState<{
    localEmojiConfigs: EmojiConfigSerialized[];
  }>(() => {
    const localEmojiConfigs = cellStudioState?.emojis
      ? Object.values(cellStudioState?.emojis)
      : [];
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

  const changeEmojiOrder = (
    draggableEmojiId: string,
    droppableEmojiId: string
  ) => {
    const draggableEmojiConfig = state.localEmojiConfigs.find(
      (e) => e.id.toString() === draggableEmojiId
    );
    const droppableEmojiConfig = state.localEmojiConfigs.find(
      (e) => e.id.toString() === droppableEmojiId
    );

    if (!draggableEmojiConfig || !droppableEmojiConfig) {
      return;
    }

    const clonedEmojiConfigs = deepClone(state.localEmojiConfigs);

    // make dragged emoji lower
    if (draggableEmojiConfig.order > droppableEmojiConfig.order) {
      console.log("dragged lower");
      const clonedDraggableEmojiConfig = clonedEmojiConfigs.find(
        (e) => e.id.toString() === draggableEmojiId
      );

      // all emojis with (order >= dropped.order && order <= dragged.order) increase order by 1
      clonedEmojiConfigs.forEach((e) => {
        if (
          e.order >= droppableEmojiConfig.order &&
          e.order < draggableEmojiConfig.order
        ) {
          e.order = e.order + 1;
        }
      });
      clonedDraggableEmojiConfig!.order = droppableEmojiConfig.order;
    } else {
      console.log("dragged higher");
    }

    const sortedEmojiConfigs = sortEmojis(clonedEmojiConfigs, true);

    setState({ localEmojiConfigs: sortedEmojiConfigs });
  };

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
    if (
      event.active.id &&
      event.over?.id &&
      event.active.id !== event.over.id
    ) {
      changeEmojiOrder(event.active.id as string, event.over.id as string);
    }
  };

  const saveAndGoBack = () => {
    dispatch(
      updateEmojisOrder({
        cellUrlId,
        reorderedEmojis: state.localEmojiConfigs.reduce((acc, emojiConfig) => {
          return {
            ...acc,
            [emojiConfig.id]: emojiConfig,
          };
        }, {}),
      })
    );
    onBackButtonClick();
  };

  return (
    <>
      <BackMenuButton onBackButtonClick={saveAndGoBack} />
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
