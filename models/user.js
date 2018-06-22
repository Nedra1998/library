var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  password: String
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.userExists = (name, callback) => {
  User.findOne({name: name}, callback);
}

module.exports.createUser = (name, password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      var user = new User({name: name, password: hash});
      user.save(callback);
    });
  });
}

module.exports.deleteUser = (name, callback) => {
  User.findOne({name: name}).remove(callback);
}

module.exports.getUserByName = (name, callback) => {
  User.findOne({name: name}, callback);
}

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, callback)
}

