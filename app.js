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
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(session({name:'session', secret: 'collectiondb', resave: false, saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());

// var mongoDB = 'mongodb://localhost/collection';
var mongoDB = 'mongodb://Admin:ArdenRasmussen1998@ds131687.mlab.com:31687/rasmussen-collection';
mongoose.connect(mongoDB);
mongoose.Promise=global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/people', peopleRouter);
app.use('/api/book', bookRouter);
app.use('/api/users', usersRouter);
app.use('/api', indexRouter);
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

global.appRoot = path.resolve(__dirname);

module.exports = app;
