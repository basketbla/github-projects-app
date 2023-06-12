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

  or if no image is found, do

  {"summary": "[SUMMARY]", "image": "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}

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
  let repoData;
  let readmeResponse;
  let languageResponse;
  let commitsResponse;
  let contributorsResponse;
  let openaiResponse;
  let openaiObj;
  for (let repo of data.repos) {
    repo = repo.name;
    repoData = {};

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
      console.log(error);
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
    includedProjects: ret,
  };

  // Add this to firebase.
  const colRef = db.collection("projects");
  await colRef.doc(username).set(bigRet);

  return ret;
});
