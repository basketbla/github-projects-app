import './SortableItem.css'
import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}

export function SortableItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 0 4px 2px #f0f0f0' : 'none',
    border: '1px solid #f0f0f0',
    marginBottom: '-1px',
    height: '50px',
    paddingLeft: '20px',
    paddingRight: '20px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  function handleRemoveItem(id: any) {
    const indexToRemove = props.items.indexOf(id);
    props.setItems([...props.items.slice(0, indexToRemove), ...props.items.slice(indexToRemove + 1)]);
    props.setOtherItems([...props.otherItems, id]);
    props.setPreventDragEnd(true);
  }
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-item">
      <div className="sortable-item-text">
        {props.id}
      </div>
      <ion-icon 
        name={props.type === "included" ? "close-outline" : "add-outline"}
        style={{
          color: 'lightgrey', 
          fontSize: '1.5rem', 
          cursor: 'pointer'
        }}
        onMouseDown={(e: any) => {e.stopPropagation(); handleRemoveItem(props.id); e.preventDefault();}}
      />
    </div>
  );
}