'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blackListSchema = Schema({
	phone: String,
	type: String,
	level:String,
	category: String
});

module.exports = mongoose.model('blackList', blackListSchema);
