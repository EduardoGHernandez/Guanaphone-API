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

module.exports = api;
