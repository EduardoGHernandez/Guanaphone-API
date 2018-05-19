'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dangerousSchema = Schema({
	id:  String,
	number:  String,
  reports :  String,
  category : String,
  level:  String,
});

module.exports = mongoose.model('Dangerous', dangerousSchema);
