'use strict'

//Cargar modelos

var BlackList = require('../models/blackList');

//
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path')

//Metodos

//Metodos de prueba
function test(req, res){
	res.status(200).send({
		message: 'BlackList test'
	});
}

module.exports = {
  test
}
