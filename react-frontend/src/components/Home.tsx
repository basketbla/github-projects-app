import React, {
  useState,
} from 'react';
import logo from '../logo.svg';
import '../App.css';
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { APP_URL, SERVER_URL } from '../utils/constants';

function Home() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [accessToken, setAccessToken] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  
  const githubAuthRedirect = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=9d3884c0fbb78844633e&redirect_uri=${APP_URL}`;
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

  const [hideLogo, setHideLogo] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{display: hideLogo ? 'none' : 'unset'}}/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div onClick={() => setHideLogo(true)}>hi</div>
        <div onClick={githubAuthRedirect}>github redirect</div>
        <div onClick={fetchGithubToken}>github code for token</div>
        <div onClick={fetchProjects}>github get projects</div>
        {
          projects.map(project => (
            <div>{project.name}</div>
          ))
        }
      </header>
    </div>
  );
}

export default Home;
