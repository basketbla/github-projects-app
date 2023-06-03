import './SelectProjects.css'
import React, {
  useState
} from 'react'
import SortableList from './SortableList'
import MyButton from './MyButton';
import { SelectProjectsWave } from '../icons/Waves';

export default function SelectProjects() {

  // Use effect: if user exists in firebase, redirect to projects page

  const [includedProjects, setIncludedProjects] = useState(["repoffdfd 1", "repo fd2", "refdsfpo 3", "repo fdsf31", "repofd3 2", "refdpo 33", "rep3ofd 31", "re3fdpo 2", "repofdsf 3", "fdsfdrepo 1", "repfdsfo 2", "repofdfd 3"]);
  const [excludedProjects, setExcludedProjects] = useState([]);

  return (
    <div id="sp-container">
      <div id="sp-title">
        Select and Order Projects
      </div>
      <div id="sp-projects-container">
        <div id="sp-included-label">
          Included
        </div>
        <SortableList 
          style={{width: '50%'}} 
          items={includedProjects} 
          setItems={setIncludedProjects} 
          setOtherItems={setExcludedProjects} 
          otherItems={excludedProjects} 
          type="included"
        />
        <div id="sp-excluded-label">
          Excluded
        </div>
        <SortableList 
          style={{width: '50%'}} 
          items={excludedProjects} 
          setItems={setExcludedProjects} 
          setOtherItems={setIncludedProjects} 
          otherItems={includedProjects}
        />
      </div>
      <div id="sp-button-container">
        <MyButton style={{width: '300px', height: '80px', marginTop: '20px'}} title={"Done!"} onClick={() => console.log('hi')}/>
      </div>
      <div id="select-projects-wave">
        {SelectProjectsWave}
      </div>
    </div>
  )
}
