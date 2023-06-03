import './SelectProjects.css'
import React, {
  useState,
  useEffect
} from 'react'
import SortableList from './SortableList'
import MyButton from './MyButton';
import { SelectProjectsWave } from '../icons/Waves';
import axios from 'axios'
import { SERVER_URL } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { ClimbingBoxLoader } from 'react-spinners';

export default function SelectProjects() {

  
  const { githubToken } = useAuth();
  
  // const [includedProjects, setIncludedProjects] = useState(["repoffdfd 1", "repo fd2", "refdsfpo 3", "repo fdsf31", "repofd3 2", "refdpo 33", "rep3ofd 31", "re3fdpo 2", "repofdsf 3", "fdsfdrepo 1", "repfdsfo 2", "repofdfd 3"]);
  const [includedProjects, setIncludedProjects] = useState([]);
  const [excludedProjects, setExcludedProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  
  // Use effect: if user exists in firebase, redirect to projects page
  // Else, fetch projects
  useEffect(() => {
    if (githubToken == null) {
      return;
    }
    const fetchProjects = async () => {
      const response = await axios.get(SERVER_URL + "/project-list", {
        params: {
          accessToken: githubToken
        }
      });
      console.log(response.data);
      setIncludedProjects(response.data);
      setFetchingProjects(false);
    }

    fetchProjects();
  }, [githubToken]);

  const fetchProjects = async () => {
    const response = await axios.get(SERVER_URL + "/project-list", {
      params: {
        accessToken: githubToken
      }
    });
    console.log(response.data);
    // setIncludedProjects(response.data);
  }

  return (
    <div id="sp-container">
      <div id="sp-title">
        Select and Order Projects
      </div>
      {
        fetchingProjects ?
        <div id="sp-loading-container">
          <div id="sp-loading-title">Fetching your projects...</div>
          <ClimbingBoxLoader color="#0099FF" />
        </div>
        :
        <>
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
        </>
      }
      <div id="select-projects-wave">
        {SelectProjectsWave}
      </div>
    </div>
  )
}
