import './MyButton.css'
import React from 'react'

export default function MyButton(props: any) {
  return (
    <div id="my-button" style={props.style} onClick={props.onClick}>{props.title}</div>
  )
}
