var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

var router = express.Router();

passport.use(new localStrategy(
  (username, password, callback) => {
    User.getUserByName(username, (err, user) => {
      if(err) console.log(err);
      if(!user){
        return callback(null, false, {'message':'incorrect username or password'});
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) console.log(err);
        if(isMatch) return callback(null, user);
        else return callback(null, false, {'message': 'incorrect username or password'});
      });
    });
  }
));

passport.serializeUser((user, callback) =>{
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  User.getUserById(id, callback);
});

router.post('/register', (req, res, next) => {
  if(req.body.name !== 'Admin' && (!req.user || req.user.name !== "Admin")) return res.json({
    'error': 'Must be admin to create users'
  });
  User.userExists(req.body.name, (err, result) => {
    if(err) console.log(err);
    if(result) res.json({'error':'User already exists'});
    else{
      User.createUser(req.body.name, req.body.password, (err, result) => {
        if(err) console.log(err);
        res.json({'success': 'Created admin user'});
      });
    }
  });
});

router.post('/delete', (req, res, next) => {
  if(!req.user || req.user.name !== "Admin") return res.json({
    'error': 'Must be admin to delete users'
  });
  User.userExists(req.body.name, (err, result) => {
    if(err) console.log(err);
    if(result){
      User.deleteUser(req.body.name, (err) => {
        if(err) console.log(err);
        res.json({'success': true});
      });
    }else{
      res.json({'error': 'User does not exist'});
    }
  })
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.json({
    success: true,
    name: req.user.name
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.json({
    loggedOut: true
  });
});

router.get('/loggedin', (req, res, next) => {
  if(req.user) res.json({'loggedIn': true, name: req.user.name});
  else res.json({'loggedIn': false, name: null});
});

module.exports = router;
