'use strict'

var mongoosePaginate = require('mongoose-pagination');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var pubController = require('../controllers/publication');
var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir:'./uploads/publications'})

api.get('/publication-test',pubController.test );
api.post('/publication', md_auth.ensureAuth, pubController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, pubController.getPublications);
api.get('/pub/:id', md_auth.ensureAuth, pubController.getPublication);
api.delete('/publication-d/:id?', md_auth.ensureAuth, pubController.deletePublication);
api.put('/upload-image-pub/:id',[md_auth.ensureAuth, mdUpload], pubController.uploadImage);
api.get('/get-image-pub/:imageFile', pubController.getImagePublication);
module.exports= api;
