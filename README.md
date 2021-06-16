# ⚙ Project Tech KSAJ

## 🧾 Table of contents

-   [About the project](##About-the-project)
      * [Built with](###Built-with)
-   [Getting started](##Getting-started)
      * [Installation](##Installation)
-   [Packages/Dependecies](##Packages/dependecies)
      * [Dependecies](##Dependecies)
      * [Dev dependecies](##Dev-dependecies)
-   [License](##License)

## 📖 About the project
For this project we created a matching app for people who likes books. You can create a account and then fill in the books that you have read, from there our application is going to look for books with the same genre as the books that you have read. Now you have a list with similar books as the ones you have read.

### 🛠 Built with
The application is build with [NodeJs](https://nodejs.org/en/) and extra features:
- [Pug templating engine](https://github.com/KoenHaagsma/ProjectTechKSA/wiki/Templating-engine)
- [MongoDB database](https://github.com/KoenHaagsma/ProjectTechKSA/wiki/Database)
- [Packages](https://github.com/KoenHaagsma/ProjectTechKSA/wiki/Packages)

## 🔍 Getting started
Before you can start using the application you need to install it on your own device. Follow the steps below to do that.

### 🔨 Installation

1. Open the terminal or open the terminal in your IDE.

2. Clone the repository
```
git clone https://github.com/KoenHaagsma/ProjectTechKSA.git
```
3. Go to the cloned repository
```
cd ../../ProjectTechKSA
```
4. Create a .env file (you do this to store data that you don't everybody to see, like passwords).
```
touch .env
```
5. Install the packages that contains in this project.
```
npm install
```
6. Start the application for development.
```
npm run dev
```
7. Open the server in the browser, go to [Localhost](http://localhost:3001/). If this doesn't work change the 3001 to your own port number. 

## 🧰 Packages/dependecies

### 🧱 Dependecies

- [bcrypt](https://www.npmjs.com/package/bcrypt)   
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-flash](https://www.npmjs.com/package/express-flash)
- [express-session](https://www.npmjs.com/package/express-session)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [path](https://www.npmjs.com/package/path)
- [pug](https://www.npmjs.com/package/pug)

### 🧱 Dev dependecies

- [chalk](https://www.npmjs.com/package/chalk)
- [concurrently](https://www.npmjs.com/package/concurrently)
- [eslint](https://www.npmjs.com/package/eslint)
- [node-sass](https://www.npmjs.com/package/node-sass)
- [nodemon](https://www.npmjs.com/package/nodemon)

## 📑 Sources

- bcrypt vs bcryptjs vs crypt vs crypto-js vs password-hash | npm trends. (z.d.). Npmtrends. Geraadpleegd op 14 juni 2021, van https://www.npmtrends.com/bcrypt-vs-bcryptjs-vs-crypt-vs-crypto-js-vs-password-hash

- Ferrara, A. (2021, March 19). Alternatives To MVC. Retrieved June 15, 2021, from https://blog.ircmaxell.com/2014/11/alternatives-to-mvc.html

- GeeksforGeeks. (2018, June 14). Model-View-Controller(MVC) architecture for Node applications. Retrieved June 1, 2021, from https://www.geeksforgeeks.org/model-view-controllermvc-architecture-for-node-applications/

- Hoffman, B. (2020, 12 juni). How Do Passwords Work? Thycotic. https://thycotic.com/company/blog/2020/05/07/how-do-passwords-work/

- H., & Hgraca, V. A. P. B. (2018, August 26). MVC and its alternatives. Retrieved June 15, 2021, from https://herbertograca.com/2017/08/17/mvc-and-its-variants/

- JavaScript | MDN. (2021, 5 mei). Mdm. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements

- Kantor, I. (z.d.). Error handling with promises. Javascript Info. Geraadpleegd op 4 juni 2021, van https://javascript.info/promise-error-handling

- Koulianos, P. (2020, 18 juli). Bcrypt vs BcryptJS Benchmark with Node.js - JavaScript in Plain English. Medium. https://javascript.plainenglish.io/node-js-bcrypt-vs-bcryptjs-benchmark-69a9e8254cc2#:%7E:text=Bcrypt%20is%203.1%20times%20faster,times%20faster%20in%20comparing%20function.

- K. (z.d.). kelektiv/node.bcrypt.js. GitHub. Geraadpleegd op 4 juni 2021, van https://github.com/kelektiv/node.bcrypt.js#readme

- Luo, M. Z. (2017, October 15). MVC vs. MVVM: How a Website Communicates With Its Data Models. Retrieved June 15, 2021, from https://hackernoon.com/mvc-vs-mvvm-how-a-website-communicates-with-its-data-models-18553877bf7d

- MVC: Model, View, Controller. (n.d.). Retrieved June 1, 2021, from https://www.codecademy.com/articles/mvc

- Reinman, A. (z.d.). Attachments :: Nodemailer. Nodemailer. Geraadpleegd op 2 juni 2021, van https://nodemailer.com/message/attachments/

- Reinman, A. (z.d.-b). Ethereal Email. Ethereal. Geraadpleegd op 14 juni 2021, van https://ethereal.email/

- StackShare. (z.d.). What are some alternatives to Nodemailer? - StackShare. Geraadpleegd op 14 juni 2021, van https://stackshare.io/nodemailer/alternatives

- Template Engines for Node.js. (z.d.). TutorialsTeacher. Geraadpleegd op 2 mei 2021, van https://www.tutorialsteacher.com/nodejs/template-engines-for-nodejs#:%7E:text=Engines%20for%20Node.-,js,and%20produce%20the%20final%20HTML.&text=Each%20template%20engine%20uses%20a,and%20inject%20data%20into%20it.

- Wikipedia contributors. (2021, May 30). Model–view–controller. Retrieved June 1, 2021, from https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller

- Wikipedia contributors. (2021, 26 mei). Bcrypt. Bcrypt. https://en.wikipedia.org/wiki/Bcrypt

## 🔖 License

[![license](https://img.shields.io/github/license/DAVFoundation/captain-n3m0.svg?style=flat-square)](https://github.com/KoenHaagsma/ProjectTechKSA/blob/main/LICENSE)
