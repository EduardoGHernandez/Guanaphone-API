'use strict'

var express = require('express');
var apiController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload =  multiPart({uploadDir:'./uploads/users'});

api.get('/dangerous',apiController.home)

module.exports = api;
