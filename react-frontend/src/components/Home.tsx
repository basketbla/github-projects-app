import React, {
  useState,
  useEffect
} from 'react';
import './Home.css';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_URL, CLIENT_ID, SERVER_URL } from '../utils/constants';
import SelectProjects from '../icons/SelectProjectsIcon'
import PreviewIcon from '../icons/PreviewIcon'
import MyButton from './MyButton';
import MyModal from './MyModal';
import { useAuth } from '../contexts/AuthContext';
import { HomeWave } from '../icons/Waves';


function Home() {

  const location = useLocation();
  const navigate = useNavigate();

  const { signInWithGithub, currentUser, githubToken } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const [accessToken, setAccessToken] = useState<any | null>(null);
  const [projects, setProjects] = useState<any>({});
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState<boolean>(false);
  const [test, setTest] = useState(0);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  // Mark when wave animation done
  useEffect(() => {
    const markAnimationsDone = async () => {
      await new Promise(r => setTimeout(r, 2000));
      setAnimationFinished(true);
    }
    markAnimationsDone();
  }, []);


  useEffect(() => {
    // Check if the font has loaded
    document.fonts.ready.then(function() {
      console.log('fonts ready');
      setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    console.log(currentUser);
    if (githubToken != null && buttonPressed) {
      navigate('/select-projects');
    }
  }, [githubToken, buttonPressed]);
  
  const githubAuthRedirect = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
  }

  const fetchGithubToken = async () => {
    const result = await axios.post(SERVER_URL + "/code-for-token", {
      code: searchParams.get('code'),
    });
    console.log(result.data);
    const responseParams = new URLSearchParams(result.data);
    setAccessToken(responseParams.get('access_token'));
  }

  const fetchProjects = async () => {
    const response = await axios.get(SERVER_URL + "/project-list", {
      params: {
        accessToken: accessToken
      }
    });
    console.log(response.data);
    setProjects(response.data);
  }

  const handleSignIn = async () => {
    await signInWithGithub();

    // Temporary workaround for expiring github auth tokens
    setButtonPressed(true);
  }

  if (!fontsLoaded) {
    return <></>
  }

  return (
    <div id="home-container">
        {/* <div onClick={githubAuthRedirect}>github redirect</div>
        <div onClick={fetchGithubToken}>github code for token</div>
        <div onClick={fetchProjects}>github get projects</div> */}
        {
          // Object.keys(projects).map(project => (
          //   <>
          //     <div>{project}</div>
              
          //     {/* <div>{projects[project].readme}</div> */}
          //     {/* <div>{JSON.stringify(projects[project].languages)}</div> */}
          //     {/* <div>{"commits: " + projects[project].numCommits}</div> */}
          //     {/* <div>{"contributors: " + projects[project].numContributors}</div> */}
          //   </>
          // ))
        }
        <div id="home-title">
          Github Preview Generator
        </div>
        <div id="home-steps-list">
          <div className="home-step">
            <div className="home-step-num">1.</div>
            <div className="home-step-image">
              <img alt="github logo" src="https://cdn-icons-png.flaticon.com/512/25/25231.png"/>
            </div>
            <div className="home-step-desc">Link your github</div>
          </div>
          <div className="home-step">
            <div className="home-step-num">2.</div>
            <SelectProjects className="home-step-image"/>
            <div className="home-step-desc">Select your projects</div>
          </div>
          <div className="home-step">
            <div className="home-step-num">3.</div>
            <PreviewIcon className="home-step-image"/>
            <div className="home-step-desc">Get a preview url and iframe!</div>
          </div>
        </div>
        <div id="get-started-container">
          {/* <MyButton style={{width: '300px', height: '80px'}} title={"Get Started!"} onClick={() => githubAuthRedirect()}/> */}
          <MyButton style={{width: '300px', height: '80px', position: 'relative', zIndex: 1}} title={"Get Started!"} onClick={() => handleSignIn()}/>
          {/* <MyButton style={{width: '300px', height: '80px', position: 'relative', zIndex: 1}} title={"Get Started!"} onClick={() => navigate('/select-projects')}/> */}
        </div>
        <MyModal 
          modalStyle={{width: "50%", height: "80%", minWidth: "400px", minHeight: "600px", padding: "50px"}} 
          show={showFAQModal} 
          setShow={setShowFAQModal}
        >
          <div id="faq-title">FAQ</div>
          <div className="faq-subtitle">What is this?</div>
          <div className="faq-body">
            I got tired of manually updating my personal website to reflect new github projects, 
            so I made this tool to link to your github and automatically make a pretty display of all your repos.
          </div>
          <div className="faq-subtitle">Does it include private repos?</div>
          <div className="faq-body">
            Yes.
          </div>
          <div className="faq-subtitle">Does it include repos that I have contributed to but aren't mine?</div>
          <div className="faq-body">
            No. The easiest workaround I've found is just to fork them. Even if they are private, you'll still be able to get stats like your commits and such.
          </div>
          <div className="faq-subtitle">Do projects get overwritten if I reselect projects?</div>
          <div className="faq-body">
            No. All existing projects will remain after you reselect projects. If you want to get rid of a project, delete it before reselecting projects.
          </div>
        </MyModal>
        <div id="home-faq" onClick={() => setShowFAQModal(true)}>
          FAQ
        </div>
        <a id="home-credit" href="https://www.rhett.lol/" rel='noreferrer' target="_blank">
          By Rhett Owen
        </a>
        <div id="home-wave">
          {HomeWave}
        </div>
    </div>
  );
}

export default Home;
