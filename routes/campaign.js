'use strict'

var express = require('express');
var campaignController = require('../controllers/campaign');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload =  multiPart({uploadDir:'./uploads/users'});

api.get('/campaign-test', campaignController.test);
api.post('/new-campaign', campaignController.saveCampaign);
api.get('/campaigns/:page?', campaignController.getCampaigns);
module.exports = api;
