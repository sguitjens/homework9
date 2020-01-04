# Developer Profile Generator

This is a command-line application that dynamically generates a PDF profile. The application uses the [Inquirer](https://www.npmjs.com/package/inquirer/) node module to prompt for the user's name, a color (to help define the styling of the page), the user's city and state of residence, the user's GitHub and LinkedIn usernames, and a short bio. The following information is retrieved from the user's GitHub repo:
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
