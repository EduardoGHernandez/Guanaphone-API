'use strict'

var express = require('express');
var mongoosePaginate = require('mongoose-pagination');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var messageController = require('../controllers/message');

api.get('/message-test',md_auth.ensureAuth, messageController.test);
api.post('/message', md_auth.ensureAuth, messageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, messageController.getReceivedMessage);
api.get('/messages/:page?',md_auth.ensureAuth, messageController.getEmittedMessage);
api.get('/unviewed-messages', md_auth.ensureAuth, messageController.countUnviewed);
api.put('/set-viewed-messages', md_auth.ensureAuth, messageController.setViewed);

module.exports = api;
