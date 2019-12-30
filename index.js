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
      default: "a Little  Dragon"
    },
    {
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
      message: "Please enter your name:",
      required: false,
      default: "sguitjens"
    },
    {
      type: "input",
      name: "linkedInUserName",
      message: "Please enter your name:",
      required: false,
      default: "sydneyguitjens"
    },
    {
      type: "input",
      name: "bio",
      message: "Please enter some bio text:",
      required: true,
      default: "I like to bite my own tail!"
    }
  ])
  // use the answers to add the github information to the data
  .then((answers, err) => {
    console.log("Your answers:", answers);
    return addGitHubInformation(answers.gitHubUserName, answers);
  })
  .then(allResponses => {
    return writeToHTML(pathToHTML, allResponses);
  })
  .then(() => {
    writeToPDF(pathToHTML, pathToPDF)
  })
}

askQuestions.catch = (err) => {
  console.log("ERROR RETURNED:", err);
};

const writeToHTML = (filename, data) => {
  let htmlfile = generate(data);
  fs.writeFile(filename, htmlfile, function(data) {
  });
}

const writeToPDF1 = (pathToHTML, pathToPDF) => {
  const conversion = convertHTMLToPDF({
    converterPath: convertHTMLToPDF.converters.PDF
  });
  conversion({file: pathToHTML}, (err, result) => {
    if (err) return console.error("ERROR MESSAGE", err);
    console.log("PDF PAGES", result.numberOfPages);
    console.log("PDF STREAM", result.stream);
    result.stream.pipe(fs.createWriteStream(pathToPDF));
  })
}

const writeToPDF = (pathToHTML, pathToPDF) => {
  var conversion = convertHTMLToPDF({
    converterPath: convertHTMLToPDF.converters.PDF
  });
  
  conversion({ file: pathToHTML }, function(err, result) {
    if (err) {
      return console.error("PDF ERROR:", err);
    }
    console.log(result.numberOfPages);
    console.log(result.logs);
    result.stream.pipe(fs.createWriteStream(pathToPDF));
  });
}

function init() {
  askQuestions();
}

// this returns all of the answers and github information as an object
const addGitHubInformation = (gitHubUserName, answers) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(`Completed in 1000`)
  //   }, 1000)
  // })
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
      })
  ])
  .then(promises => {
    console.log(promises); // this is what is expected
    let promisesObj = { // this returns "undefined"
      followerCount: promises[0],
      followingCount: promises[1],
      starCount: promises[2],
      repoCount: promises[3]
    }
    Object.assign(answers, promisesObj);
    console.log("FULL LIST?", answers);
    return answers;
  });
} 

init();
