'use strict'

var express = require('express');
var reportedPhonesController = require('../controllers/reportedPhones');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload =  multiPart({uploadDir:'./uploads/audio'});
var text_upload =  multiPart({uploadDir:'./uploads/text'});

//

api.get('/reportedPhones', reportedPhonesController.test);
api.post('/save-in-reportedPhones', reportedPhonesController.saveInReportedPhones);
//api.get('/is-in-blacklist/:phone', blackListController.isInBlackList);
module.exports = api;
