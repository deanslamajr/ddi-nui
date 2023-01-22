import React from "react";
import { useDraggable } from "@dnd-kit/core";

const Draggable: React.FC<React.PropsWithChildren<{ draggableId: string }>> = ({
  children,
  draggableId,
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: draggableId,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default Draggable;
