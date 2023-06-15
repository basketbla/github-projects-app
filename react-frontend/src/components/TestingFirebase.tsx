import React from 'react'
import { testingPersist } from '../utils/firebase'

export default function TestingFirebase() {

  const persistTest = async () => {
    const result = await testingPersist();
    console.log(result);
  }
  return (
    <div>
      TestingFirebase
      <div onClick={persistTest}>Test Persist</div>
    </div>
  )
}