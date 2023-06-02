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
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
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
          {props.items.map((id: any) => <SortableItem key={id} id={id} {...props} setPreventDragEnd={setPreventDragEnd}/>)}
        </div>
      </SortableContext>
    </DndContext>
  );
}