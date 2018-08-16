var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

var session = require('cookie-session');
var passport = require('passport');
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var peopleRouter = require('./routes/people');
var bookRouter = require('./routes/books.js');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));

app.use(session({name:'session', secret: 'collectiondb', resave: false, saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());

var mongoDB = 'mongodb://localhost/collection';
mongoose.connect(mongoDB);
mongoose.Promise=global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/', indexRouter);
app.use('/people', peopleRouter);
app.use('/book', bookRouter);
app.use('/users', usersRouter);

global.appRoot = path.resolve(__dirname);

module.exports = app;
