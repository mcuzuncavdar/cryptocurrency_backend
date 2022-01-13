const express = require('express');
const createError = require('http-errors');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoose = require("mongoose");
require("dotenv").config();
let http = require('http');
let https = require('https');
let fs = require('fs');

const indexRouter = require('./routes/index');
const coinMarketCapRouter = require('./routes/coinmarketcap');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const emailRouter = require('./routes/email');

const app = express();
const mongoURI = process.env.MONGO_DB_URI;

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(mongoURI, {

}, () => {

})

mongoose.connection.on('connected', () => {
  console.log('Connection successful');
})

mongoose.connection.on('error', (error) => {
  console.log(error, 'MongoDB error');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Log Requests according to dev or prod

app.use(logger('dev', {
  skip: (req, res) => res.statusCode < 400,
}));

logger.token('body', (req, res) => JSON.stringify(req.body));
app.use(logger(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]', {
  skip: (req, res) => res.statusCode > 300,
  stream: fs.createWriteStream(path.join(__dirname, 'logs/access.log'), {flags: 'a'})
}))
app.use(logger(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]', {
  skip: (req, res) => res.statusCode < 400,
  stream: fs.createWriteStream(path.join(__dirname, 'logs/error.log'), {flags: 'a'})
}))

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-auth-token, content-type, authorization, Authorization");
    return res.status(200).send();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Expose-Headers", "authorization");
  res.header("Access-Control-Expose-Headers", "Authorization");
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, x-auth-token, authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  next();
});

app.use(express.json()); // Json gelen dataları alıp işliyor
app.use(express.urlencoded({extended: true}));
app.use(helmet()); // Zararlı requestleri test edip engelleme yapıyor
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Creates the routes

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/coinmarketcap', coinMarketCapRouter);
app.use('/email', emailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Creates HTTPS Server
const port = 8080;
app.set('port', port);

const options = {};
let httpServer = http.createServer(options, app);
let httpsServer = https.createServer(options, app);

httpServer.listen(port);

httpServer.on('listening', (error) => {
  console.log('Listening ' + httpServer.address().port + ' port');
});

httpServer.on('error', (error) => {
  switch (error.code) {
    case 'EACCES':
      console.error('Port requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(port + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
