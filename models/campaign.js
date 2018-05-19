'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var campaignSchema = Schema({
	name:  String,
	image:  String,
  age :  String,
  city : String,
  state:  String,
  expire_date :  String,
  blood_type:  String,
  contact_name : String,
  phone: String,
  hospital: String,
  bed: String,
  room: String,
  num_donators: String
});

module.exports = mongoose.model('Campaign', campaignSchema);
