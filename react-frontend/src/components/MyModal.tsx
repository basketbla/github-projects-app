import './MyModal.css'
import React, {
  useEffect
} from 'react'

export default function MyModal(props: any) {
  return (
    <div id="modal-background" style={{display: props.show ? 'flex' : 'none'}} onClick={() => { if (!props.noClickToClose) {props.setShow(false)}}}>
      <div id="modal-panel" style={{...props.modalStyle}} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  )
}
