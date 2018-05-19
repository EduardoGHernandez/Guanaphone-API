'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blackListSchema = Schema({
	id: String,
	number: String,
	audio: String,
	text: String,
	type: String,
});

module.exports = mongoose.model('blackList', blackListSchema);
