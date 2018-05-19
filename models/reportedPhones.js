'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportedPhonesSchema = Schema({
	phoneE:  String,
	phoneV: String,
	audio :  String,
	text : String,
	category:  String
});

module.exports = mongoose.model('reportedPhones', reportedPhonesSchema);
