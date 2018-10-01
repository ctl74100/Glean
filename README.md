# Team TurkeyApp

## Overview
Team Turkey presents Glean, a change to charity program that will help you feel that little goodness, those warm fuzzies for putting your money to good use.

You make a purchase, Glean rounds up the cost, subtracts the actual purchase from the cost, and that difference goes to a charity of your choice!

Glean does this by integrating into your bank account and keeping track of the charges you make. It’s easy, safe, and secure.

## How To Run

Aquire the credentials.js file for database authentication from an admin. Place this file in the main directory.

Run the following commands in bash:

```bash
npm install
node app.js
```
## Libraries

``express-handlebars``
  * https://github.com/ericf/express-handlebars.git
  * used as the template engine for the project

``body-parser``
  * https://github.com/expressjs/body-parser.git
  * used to retrieve the body of requests

``express-session``
  * https://github.com/expressjs/session.git
  * used for establishing sessions with clients of the site

``connect-flash``
  * https://github.com/jaredhanson/connect-flash.git
  * used to send messages to views (i.e. when a user is redirected to a new page)

``cookie-parser``
  * https://github.com/expressjs/cookie-parser.git
  * needed for the use of sessions using express-sessions

``morgan``
  * https://github.com/expressjs/morgan.git
  * used for logging HTTP requests

## Views

``home``
  * Main landing page for users not logged into Glean. This page is meant mostly for promotional purposes to attract users to the service. Currently, there is a description of the service, and navigation for users to access an about page and a page to learn about the team.

``login``
  * Login screen for users seeking to sign-in to Glean. If users forget their password, a link to reset a user's password is accessible from the page.

``forgotPassword``
 * ForgotPassword view is used to help user to find their passwords. When user forget their passwords, they can go to forgot password page and enter their information, and then the server find the password.

``dashboard``
 * Dashboard showing statistics for the user, including .

``profile``
  * Profile view shows the information of the user. User can also change their information.

``register``
  * Sign up a new account.

``about``
  * Information about Glean.

``admin``
  * Shows information of all users and all transaction. Administrators can also search for some data.

``adminhome``
  * Home page of Admin which is slightly different from the regular home page and user home page.

``userhome``
  * Home page of the User which is slightly different from the regular home page and admin home page.

``404``
  * It shows when page is not found.

``505``
  * It shows when there is an error.

``check_user_info``
  * It confirms the information of the user for finding password.

``team``
  * Profiles of all team members.


## Session States

There are three states: logged in as users, logged in as admin and not-logged in.

When the user is non-logged in, they may only access the following views:

  `home`
  `team`
  `login`
  `register`
  `forgetPassword`
  `about`

When the user is logged in as a user, they may only access the following views:

  `userhome`
  `dashboard`
  `profile`
  `team`
  `login`
  `register`
  `forgetPassword`
  `about`

When the user is logged in as an admin, they may only access the following views:

  `admin`
  `adminhome`
  `home`
  `team`
  `login`
  `register`
  `forgetPassword`
  `about`

There are two JavaScript files for routing. One is `user-routes.js` and the other is `admin-routes.js`. They are in the directory called `routes`. `user-routes.js` handles the routes to the views only for users. `admin-routes.js` handles the routes to the views only for admin. There are also some route handling in `app.js` for general routes accessible to non-users.


[user-routes.js](routes/user-routes.js) ,
[admin-routes.js](routes/admin-routes.js) ,
[app.js](app.js)



## Persistence

![database diagram](/gleanDB.png)

The diagram above is the schema of collections in the database. The documents are created within the `/lib/database.js` file and are wrapped up with functions for adding, finding, removing and updating these documents. `mongoose` is utilized to better facilitate modeling.

The documents are listed below:

`User` : user information / credentials for login

`Credit` : credit card information to be used when making purchases

`Transaction` : transaction made by a user

`Charity` : charity identifier

[database.js](lib/database.js)
