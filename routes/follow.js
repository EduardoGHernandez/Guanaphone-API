'use strict'

var express = require('express');
var followController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');


api.get('/test-follow',md_auth.ensureAuth, followController.test);
api.post('/follow', md_auth.ensureAuth, followController.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, followController.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, followController.getUsersFollowed);
api.get('/following-me/:page?', md_auth.ensureAuth, followController.getUsersFollowingMe);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, followController.getMyFollows);
module.exports = api;
