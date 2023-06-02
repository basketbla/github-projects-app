import './MyButton.css'
import React from 'react'

export default function MyButton(props: any) {
  return (
    <div id="my-button" style={{height: props.height, width: props.width}} onClick={props.onClick}>{props.title}</div>
  )
}
