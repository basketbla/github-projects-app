import './SelectProjects.css'
import React, {
  useState
} from 'react'
import SortableList from './SortableList'
import MyButton from './MyButton';

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L48,117.3C96,139,192,181,288,208C384,235,480,245,576,234.7C672,224,768,192,864,197.3C960,203,1056,245,1152,256C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      </div>
    </div>
  )
}
