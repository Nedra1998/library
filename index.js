const express = require('express');
require('dotenv').config()

var cookieParser = require('cookie-parser');
var formParser = require('express-form-data');
var session = require('cookie-session');

var passport = require('passport');
var mongoose = require('mongoose');

var cors = require('cors');

var apiRouter = require('./routes/index.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(formParser.format());
app.use(formParser.stream());
app.use(formParser.union());
app.use(session({
  name: 'rasmussen-collection',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

const mongodb = 'mongodb://Admin:' + process.env.DB_SECRET + '@ds131687.mlab.com:31687/rasmussen-collection';
mongoose.connect(mongodb, {useNewUrlParser: true});
mongoose.Promise=global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/', apiRouter);

app.listen(8000);
