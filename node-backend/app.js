const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

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
      client_id: '9d3884c0fbb78844633e',
    }
  });
  res.send(response.data);
});

app.post('/code-for-token', async (req, res) => {
  let response;
  try {
    response = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: "9d3884c0fbb78844633e",
      client_secret: "ad0746643545f42c29eef42f488849fb2d18db43",
      code: req.body.code,
    });
  } catch (error) {
    console.log(error);
  }
  res.send(response.data);
});

app.get('/project-list', async (req, res) => {
  const { accessToken } = req.query;
  console.log(accessToken);
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };
  let usernameResponse;
  try {
    usernameResponse = await axios.get("https://api.github.com/user", { headers });
  } catch (error) {
    console.log("username error");
  }

  let username = usernameResponse?.data.login
  console.log(username);

  let response;
  try {
    response = await axios.get(`https://api.github.com/users/${username}/repos`, { headers });
  } catch (error) {
    console.log("error with projects");
  }
  res.send(response?.data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});