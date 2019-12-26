const inquirer = require("inquirer");
const colornames = require("colornames");
const axios = require("axios");
const convertHTMLToPDF = require("electron-html-to"); // HTML conversion tool: convert to PDF
const fs = require("fs");
const util = require("util");
const generate = require("./generateHTML");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const linkedInBaseURL = "https://www.linkedin.com/in/";
const gitHubBaseURL = "https://api.github.com";
const pathToHTML = "./index.html";
const pathToPDF = "./assets/profile.pdf";

// function to ask questions
const askQuestions = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      messaage: "Please enter your full name:",
      required: true,
      default: "Little  Dragon"
    },
    { // make this a radio button with green, blue, pink, and red
      type: "list",
      name: "color",
      message: "Please enter your favorite color:",
      choices: ["green", "blue", "pink", "red"],
      required: true,
      default: "red"
    },
    {
      type: "input",
      name: "city",
      messaage: "Please enter your city of residence:",
      required: true,
      default: "Portland"
    },
    {
      type: "input",
      name: "state",
      messaage: "Please enter your state of residence:",
      required: true,
      default: "OR"
    },
    {
      type: "input",
      name: "githubUserName",
      messaage: "Please enter your name:",
      required: false,
      default: "sguitjens"
    },
    {
      type: "input",
      name: "linkedInUserName",
      messaage: "Please enter your name:",
      required: false,
      default: "No LinkedIn"
    },
    {
      type: "input",
      name: "bio",
      message: "Please enter some bio text:",
      required: true,
      default: "I am a little dragon!"
    }
  ])
  .then(answers => {
    console.log("Your answers:", answers);
    getGitHubInformation(answers.githubUserName);
    return answers;
  })
  .then(answers => {
    return writeToHTML(pathToHTML, answers);
  })
  .then(() => {
    writeToPDF(pathToPDF, pathToHTML)
  })
}

const writeToHTML = (filename, data) => {
  let htmlfile = generate(data);
  fs.writeFile(filename, htmlfile, function(data) {
  });
}

const writeToPDF = (pathToHTML) => {
  // look at week in class exercises #40 - Rani sent out the solution
  // look up electron-html-to
  const conversion = convertHTMLToPDF({
    converterPath: convertHTMLToPDF.converters.PDF
  });
  console.log("PDF PAGES", conversion.pages);
  console.log("PDF STREAM", conversion.stream);
  conversion({file: pathToHTML}, (err, result) => {
    if (err) return console.error("ERROR MESSAGE", err);
    result.stream.pipe(fs.createWriteStream("profile.pdf"));
  });
}

/*
conversion will return number of pages and stream


fs.readFile('index.html', 'utf8', (err, htmlString) => {
  // add local path in case your HTML has relative paths
  htmlString = htmlString.replace(/href="|src="/g, match => {
    return match + 'file://path/to/you/base/public/directory';
  });
  const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF,
    allowLocalFilesAccess: true
  });
  conversion({ html: htmlString }, (err, result) => {
    if (err) return console.error(err);
    result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
  });
});
*/


const gitHubUserName = "sguitjens";

function init() {
  // ask questions and create the HTML
  askQuestions()

  // let obj = {color: "red"};
  // let htmlfile = generate(obj);
  // fs.writeFile("index.html", htmlfile, function(data) {
  //   console.log("make a pdf here");
  // });
}

const getGitHubInformation = gitHubUserName => {
  //https://api.github.com/search/users?q=sguitjens
  // repos URL: https://api.github.com/users/sguitjens/repos
  // followers, stars, following
  axios
  .get(`${gitHubBaseURL}/users/${gitHubUserName}/followers`)
  .then(function(res) {
  // console.log(res.data);
  console.log("NUMBER OF FOLLOWERS", res.data.length);
  });

  axios
  .get(`${gitHubBaseURL}/users/${gitHubUserName}/following`)
  .then(function(res) {
  // console.log(res.data);
  console.log("NUMBER FOLLOWING", res.data.length);
  });

  axios
  .get(`${gitHubBaseURL}/users/${gitHubUserName}/starred`)
  .then(function(res) {
    // console.log(res.data);
    console.log("NUMBER OF STARS", res.data.length);
  });

  axios
  .get(`${gitHubBaseURL}/users/${gitHubUserName}/repos`)
  .then(function(res) {
    // console.log(res.data);
    console.log("NUMBER OF REPOS", res.data.length);
  });
}

init();

/*
GitHub Link URLs:
Repos: `https://github.com/${username}?tab=repositories`
Followers: `https://github.com/${username}?tab=followers`
GitHub Stars: `https://github.com/${username}?tab=stars`
Following: `https://github.com/${username}?tab=following`
*/

/*
Your answers: { 
  name: 'Little  Dragon',
  color: 'red',
  city: 'Portland',
  state: 'OR',
  githubUserName: 'No GitHub Pages',
  linkedInUserName: 'No LinkedIn',
  bio: 'I am a little dragon!' }
*/
