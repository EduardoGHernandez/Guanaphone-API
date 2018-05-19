'use strict'

var express = require('express');
var uiController = require('../controllers/ui');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload =  multiPart({uploadDir:'./uploads/ui'});

api.get('/get-icon/:imageFile', uiController.getImageUI);

module.exports = api;
