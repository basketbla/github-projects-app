import React, {useState} from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {SortableItem} from './SortableItem';

export default function SortableList(props: any) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [preventDragEnd, setPreventDragEnd] = useState(false);

  function handleDragEnd(event: any) {
    if (preventDragEnd) {
      setPreventDragEnd(false);
      return;
    }
    
    const {active, over} = event;
    
    if (active.id !== over.id) {
      props.setItems((items: any) => {
        const itemIds = items.map((obj: any) => obj.id);
        const oldIndex = itemIds.indexOf(active.id);
        const newIndex = itemIds.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={props.items}
        strategy={verticalListSortingStrategy}
      >
        <div style={props.style}>
          {props.items.map((project: any) => <SortableItem key={project.id} id={project.id} project={project} {...props} setPreventDragEnd={setPreventDragEnd}/>)}
        </div>
      </SortableContext>
    </DndContext>
  );
}