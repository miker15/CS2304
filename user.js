var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
  id:  String,
  postTime: Number,
  author:   { email: String, name: String},
  message: String
});

module.exports = mongoose.model('users', user);