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
import { generatePreview } from '../utils/firebase';
import { db } from '../utils/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function SelectProjects() {

  let navigate = useNavigate();

  
  const { githubToken, currentUser } = useAuth();
  
  // const [includedProjects, setIncludedProjects] = useState(["repoffdfd 1", "repo fd2", "refdsfpo 3", "repo fdsf31", "repofd3 2", "refdpo 33", "rep3ofd 31", "re3fdpo 2", "repofdsf 3", "fdsfdrepo 1", "repfdsfo 2", "repofdfd 3"]);
  const [includedProjects, setIncludedProjects] = useState([]);
  const [excludedProjects, setExcludedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Fetching your projects...");
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (githubToken == null) {
        return;
      }

      // if user exists in firebase, redirect to projects page
      // Else, fetch projects
      // const docRef = doc(db, "projects", currentUser.uid);
      // const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) {

      //   // Sleep 2 seconds for animation 
      //   await new Promise(r => setTimeout(r, 2000));
      //   navigate(`/${docSnap.data().username}`, { state: {projectData: docSnap.data().includedProjects}});
      // }

      const response = await axios.get(SERVER_URL + "/project-list", {
        params: {
          accessToken: githubToken
        }
      });
      console.log(response.data);
      setIncludedProjects(response.data);
      setLoading(false);
    }

    fetchProjects();
  }, [githubToken]);

  const getProjectDetails = async () => {
    setLoadingMessage("Generating your previews. This may take a moment...")
    setLoading(true);

    // wait on cloud function that gets all github info and adds it to db
    await generatePreview({username: "basketbla", accessToken: githubToken, repos: includedProjects})

    // CHANGE THIS TO ACTUALLY RETURN STUFF

    // Go to preview page -> how do we want waves to work?
    const username = 'basketbla';
    navigate(`/${username}`);
  }
  

  return (
    <div id="sp-container">
      <div id="sp-title">
        Select and Order Projects
      </div>
      {
        loading ?
        <div id="sp-loading-container">
          <ClimbingBoxLoader color="#0099FF" size={30}/>
          <div id="sp-loading-title">{loadingMessage}</div>
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
            <MyButton style={{width: '300px', height: '80px', marginTop: '20px', zIndex: 1, position: "absolute"}} title={"Done!"} onClick={getProjectDetails}/>
          </div>
        </>
      }
      <div id="select-projects-wave">
        {SelectProjectsWave}
      </div>
    </div>
  )
}
