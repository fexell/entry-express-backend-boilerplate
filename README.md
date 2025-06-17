# entry-express-backend-boilerplate
This is a sign up & login boilerplate, which handles signing up
and logging in users (which I call "entry"). It also comes with authentication middlewares,
such as middleware for checking if the user's email is verified,
access & refresh token authentication, revoked token, and so on.
There are also a lot of security measures in place, such as rate-limit,
slow down rate limit, helmet, fingerprint prevention, etc.
It also comes with i18n (i18next) already set up and ready to use.

Most of the logic & validation for signing up is handled in the
`User.model.js` file. So don't be alarmed when there are like
no checks made in the `User.controller.js => SignUp` method.

## Routes
```
GET -> /api/csrf => Generates a CSRF token  

GET -> /api/auth/units => Units the user is logged in on
PUT -> /api/auth/units/revoke/:refreshTokenId => Revokes a refresh token  
POST -> /api/auth/login => Logs in the user  
POST -> /api/auth/logout => Logs out the user  
PUT -> /api/auth/email/verify/:evt => Verifies an email

GET -> /api/user => Retrieves a user's information  
POST -> /api/user => Signs up the user

POST -> /api/lang/ => Changes the language (i18next)  
PUT -> /api/lang/ => Changes the language (i18next)
```

## Clone repo
> git clone https://github.com/fexell/entry-express-backend-boilerplate.git folder-name

## Install packages
```
npm i
```
or
```
npm install
```

To install packages.

## Remember
Remember to create a .env file with secrets, port, mongodb uri, etc.

These are the environment variables that needs to be set:
```
NODE_ENV = development
PORT = 5000
JWT_SECRET = S3CR3T # Change this to an appropriate secret
COOKIE_SECRET = S3CR3T # Change this to an appropriate secret
SESSION_SECRET = S3CR3T # Change this to an appropriate secret
CSRF_SECRET = S3CR3T # Change this to an appropriate secret
DB_STRING = mongodb://localhost:27017/eeb
```

## RSA Keys
Generate your own private & public RSA keys
and name them "jwt.key" & "jwt.key.pub."
These are used for jsonwebtoken.