const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

// Old (oauth app) id
// const CLIENT_ID = "9d3884c0fbb78844633e";
// const CLIENT_SECRET = "ad0746643545f42c29eef42f488849fb2d18db43";

const CLIENT_ID = "Iv1.e11b4b8b607c5121";
const CLIENT_SECRET = "08c44926f1e82f83a2c071dd50097434ea08028b";

// Enable CORS
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define routes
app.get('/auth', async (req, res) => {
  const response = await axios.get('https://github.com/login/oauth/authorize', {
    params: {
      client_id: CLIENT_ID,
    }
  });
  res.send(response.data);
});

app.post('/code-for-token', async (req, res) => {
  let response;
  try {
    response = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: req.body.code,
    });
  } catch (error) {
    console.log(error);
  }
  res.send(response.data);
});

app.get('/project-list', async (req, res) => {
  const { accessToken } = req.query;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  // Get username
  let usernameResponse;
  try {
    usernameResponse = await axios.get("https://api.github.com/user", { headers });
  } catch (error) {
    console.log("username error");
  }
  let username = usernameResponse?.data.login

  // Get list of user repos (public and private)
  let response;
  try {
    response = await axios.get(`https://api.github.com/user/repos?type=all`, { headers });
  } catch (error) {
    console.log("error with projects");
  }

  let ret = response?.data;

  // // Get other data from the repos
  // let ret = {};
  // let repoData;
  // let readmeResponse;
  // let languageResponse;
  // let commitsResponse;
  // let contributorsResponse;
  // for (repo of response?.data) {
  //   repo = repo.name;
  //   repoData = {};

  //   // Get readmes
  //   try {
  //     readmeResponse = await axios.get(`https://raw.githubusercontent.com/${username}/${repo}/main/README.md`, { headers });
  //     repoData.readme = readmeResponse?.data;
  //   } catch (error) {
  //     console.log("error with readmes");
  //   }

  //   // Get languages
  //   try {
  //     languageResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/languages`, { headers });
  //     repoData.languages = languageResponse?.data;
  //   } catch (error) {
  //     console.log("error with languages");
  //   }

  //   // Get lines and commits written by user
  //   try {
  //     commitsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits?author=${username}`, { headers });
  //     repoData.numCommits = commitsResponse.data.length;
  //   }
  //   catch (error) {
  //     console.log("error with commits");
  //   }

  //   // Get lines and commits written by user
  //   try {
  //     contributorsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/contributors`, { headers });
  //     repoData.numContributors = contributorsResponse.data.length;
  //   }
  //   catch (error) {
  //     console.log("error with contributors");
  //   }

  //   ret[repo] = repoData;
  // }

  res.send(ret);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});