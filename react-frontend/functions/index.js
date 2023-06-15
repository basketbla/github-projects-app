// import * as openai from "openai";
const {Configuration, OpenAIApi} = require("openai");
const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const OPENAI_KEY = functions.config().openai.key;
const configuration = new Configuration({
  apiKey: OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// helper that turns readme into prompt
const generatePrompt = (readme) => {
  return `write a 3-5 sentence summary of the project based on this text, 
  highlighting technical features, and extract the first image 
  (ONLY include the image URL).
  Give the output in the form:

  {"summary": "[SUMMARY]", "image": "[IMAGE]"}

` + readme.substr(0, 500);
};


// Takes in list of projects, gets details, adds to firebase
exports.generatePreview = functions.https.onCall(async (data, context) => {
  // const uid = context.auth.uid;
  const headers = {
    "Authorization": `Bearer ${data.accessToken}`,
  };

  const username = data.username;
  const ret = {};

  const colRef = db.collection("projects");

  const existingSnapshot = await colRef.doc(username).get();
  if (existingSnapshot.exists) {
    const existingData = existingSnapshot.data();
    for (const key in existingData.includedProjects) {
      if (!(key in ret)) {
        ret[key] = existingData.includedProjects[key];
      }
    }
  }


  let repoData;
  let readmeResponse;
  let languageResponse;
  let commitsResponse;
  let contributorsResponse;
  let openaiResponse;
  let openaiObj;
  let idx = Object.keys(ret).length;
  for (let repo of data.repos) {
    repo = repo.name;

    // Project summary already exists, continue
    if (repo in ret) {
      continue;
    }

    repoData = {};

    repoData.idx = idx;
    idx++;
    repoData.title = repo;

    // Get readmes
    try {
      readmeResponse = await axios.get(`https://raw.githubusercontent.com/${username}/${repo}/main/README.md`, {headers});
      repoData.readme = readmeResponse?.data;

      // Summarize readme
      // Feed first 500 characters of readme into GPT3,
      // extract summary and image
      openaiResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "system", content: generatePrompt(repoData.readme)}],
      });
      openaiObj = JSON.parse(openaiResponse.data.choices[0].message.content);
      repoData.summary = openaiObj.summary;
      repoData.image = openaiObj.image;
    } catch (error) {
      console.log("error with readmes");
    }


    // Get languages
    try {
      languageResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/languages`, {headers});
      repoData.languages = languageResponse?.data;
      repoData.languagesString = String(Object.keys(languageResponse?.data)
          .map((lang) => " " + lang)).substring(1);
    } catch (error) {
      console.log("error with languages");
    }

    // Get lines and commits written by user
    try {
      commitsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits?author=${username}`, {headers});
      repoData.numCommits = commitsResponse.data.length;
    } catch (error) {
      console.log("error with commits");
    }

    // Get lines and commits written by user
    try {
      contributorsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/contributors`, {headers});
      repoData.numContributors = contributorsResponse.data.length;
    } catch (error) {
      console.log("error with contributors");
    }

    ret[repo] = repoData;
  }

  const bigRet = {
    username: username,
    uid: context.auth.uid,
    wavesEnabled: true,
    includedProjects: ret,
  };

  // Add metadata in case it isn't there
  await colRef.doc(username).update(bigRet);

  return ret;
});

exports.getProjectList = functions.https.onCall(async (data, context) => {
  const headers = {
    "Authorization": `Bearer ${data.accessToken}`,
  };

  let response;
  try {
    response = await axios.get(`https://api.github.com/user/repos?type=all`, {headers});
  } catch (error) {
    console.log("project error");
    return {};
  }

  return response?.data;
});

exports.testingPersist = functions.https.onCall(async (data, context) => {
  const colRef = db.collection("projects");

  const ret = {};

  const existingSnapshot = await colRef.doc("basketbla").get();
  if (existingSnapshot.exists) {
    const existingData = existingSnapshot.data();
    for (const key in existingData.includedProjects) {
      if (!(key in ret)) {
        ret[key] = existingData.includedProjects[key];
      }
    }
  }

  return ret;
});
