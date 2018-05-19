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

function saveInBlackList(req, res){
  var params = req.body;
  var blackList = new BlackList();
  blackList.phone = params.phone;
  blackList.type = params.level;
  blackList.level = params.level;
  blackList.category = params.category;
  console.log("Guardando: " + blackList.phone);
  blackList.save((err, userStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar usuario'});
						if(userStored){
							console.log("Legen... Wait for it...");
							return res.status(200).send({user : userStored});
							console.log("...dary");
						}else{
							return res.status(404).send({message: 'No se ha registrado al usuario'});
						}
					});
}

module.exports = {
  test
}
