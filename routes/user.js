'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload =  multiPart({uploadDir:'./uploads/users'});

api.get('/home', userController.home);
api.get('/test',md_auth.ensureAuth,  userController.test);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);
api.put('/update-user/:id',md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageUser);
api.get('/count-users/:id?', md_auth.ensureAuth, userController.getCounters);
module.exports = api;
