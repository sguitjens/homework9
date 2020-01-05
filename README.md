# Developer Profile Generator

This is a command-line [Node.js](https://nodejs.org/en/) application that dynamically generates a PDF profile. The application uses the [Inquirer](https://www.npmjs.com/package/inquirer/) node module to prompt for the following user information:
   * Name
   * A color (to help define the styling of the page)
   * City of residence
   * State of residence
   * GitHub username
   * LinkedIn username
   * A short bio
   

The following information is retrieved from GitHub about the user's account:
   * A photo of the user
   * Number of public repos
   * Number of stars
   * Number of followers
   * Number of users being followed

The application generates an HTML bio page using the information gathered from the questions and from GitHub. It then uses the [electron-html-to](https://www.npmjs.com/package/electron-html-to) node module to generate a PDF of the bio page from the HTML page. The application saves the PDF to the same directory as the HTML and javascripg files.

To invoke the application, use the following command:

```sh
node index.js
```

Below is an example of the page using the "green" color scheme.

![Example User Profile Page](/screenshots/profile_example.png)
