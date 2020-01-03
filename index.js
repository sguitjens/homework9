const inquirer = require("inquirer");
const axios = require("axios");
const convertHTMLToPDF = require("electron-html-to"); // HTML conversion tool: convert to PDF
const fs = require("fs");
const util = require("util");
const generate = require("./generateHTML");

const gitHubBaseURL = "https://api.github.com";
const pathToHTML = "./index.html";
const pathToPDF = "./profile.pdf";

// function to ask questions
const askQuestions = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Please enter your full name:",
      required: true,
      default: "the Eyeball of Doom"
    },
    {
      type: "list",
      name: "color",
      message: "Please enter your favorite color:",
      choices: ["green", "blue", "pink", "red"],
      required: true,
      default: "green"
    },
    {
      type: "input",
      name: "city",
      message: "Please enter your city of residence:",
      required: true,
      default: "Portland"
    },
    {
      type: "input",
      name: "state",
      message: "Please enter your state of residence:",
      required: true,
      default: "OR"
    },
    {
      type: "input",
      name: "githubUserName",
      message: "Please enter your GitHub user name:",
      required: false,
      default: "sguitjens"
    },
    {
      type: "input",
      name: "linkedInUserName",
      message: "Please enter your LinkedIn user name:",
      required: false,
      default: "sydneyguitjens"
    },
    {
      type: "input",
      name: "bio",
      message: "Please enter some bio text:",
      required: true,
      default: "I see all of the things!"
    }
  ])
  // use the answers to add the github information to the data
  .then((answers, err) => {
    return addGitHubInformation(answers.gitHubUserName, answers);
  })
  .then(allResponses => writeToHTML(pathToHTML, allResponses))
  .then(() => writeToPDF(pathToHTML, pathToPDF));
}

askQuestions.catch = (err) => {
  console.log("ERROR RETURNED:", err);
};

const writeToHTML = (filename, data) => {
  let htmlfile = generate(data);
  fs.writeFile(filename, htmlfile, function(data) {
  });
}

const writeToPDF = (pathToHTML, pathToPDF) => {
  const conversion = convertHTMLToPDF({
    converterPath: convertHTMLToPDF.converters.PDF,
    allowLocalFilesAccess: true 
  });
  fs.readFile(pathToHTML, "utf8", (err, htmlString) => {
    conversion({html: htmlString}, (err, result) => {
      if (err) return console.error("ERROR MESSAGE", err);
      result.stream.pipe(fs.createWriteStream(pathToPDF));
      conversion.kill();
    })
  }) 
}

function init() {
  askQuestions();
}

// this returns all of the answers and github information as an object
const addGitHubInformation = (gitHubUserName, answers) => {
  return Promise.all([
    axios
      .get(`${gitHubBaseURL}/users/${gitHubUserName}/followers`)
      .then(function(res) {
        return res.data.length;
      }),

    axios
      .get(`${gitHubBaseURL}/users/${gitHubUserName}/following`)
      .then(function(res) {
        return res.data.length;
      }),

    axios
      .get(`${gitHubBaseURL}/users/${gitHubUserName}/starred`)
      .then(function(res) {
        return res.data.length;
      }),

    axios
      .get(`${gitHubBaseURL}/users/${gitHubUserName}/repos`)
      .then(function(res) {
        return res.data.length;
      }),

    axios
      .get(`https://api.github.com/users/sguitjens`)
      .then(function(res) {
        return res.data.avatar_url;
      })
  ])
  .then(promises => {
    let promisesObj = {
      followerCount: promises[0],
      followingCount: promises[1],
      starCount: promises[2],
      repoCount: promises[3],
      avatarURL: promises[4]
    }
    Object.assign(answers, promisesObj);
    return answers;
  });
} 

init();
