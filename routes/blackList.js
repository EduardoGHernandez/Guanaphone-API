'use strict'

var express = require('express');
var blackListController = require('../controllers/blackList');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload =  multiPart({uploadDir:'./uploads/audio'});
var text_upload =  multiPart({uploadDir:'./uploads/text'});

//

api.get('/blackList', blackListController.test);
api.post('/save-in-blacklist', blackListController.saveInBlackList);
api.get('/is-in-blacklist/:phone', blackListController.isInBlackList);
module.exports = api;
