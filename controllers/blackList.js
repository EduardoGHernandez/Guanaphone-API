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
  console.log(req.body);
  if(!params.phone || !params.type || !params.level || !params.category)
    return res.status(500).send({message: 'Error al guardar en blacklist: Faltan parametros'});
  blackList.phone = params.phone;
  blackList.type = params.type;
  blackList.level = params.level;
  blackList.category = params.category;
  console.log("Guardando: " + blackList.phone);
  blackList.save((err, userStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar en blacklist'});
						if(userStored){
							console.log("Legen... Wait for it...");
							return res.status(200).send({user : userStored});
							console.log("...dary");
						}else{
							return res.status(404).send({message: 'No se ha registrado en blacklist'});
						}
					});
}

function isInBlackList(req, res){
	var searched = req.params.phone;
	if(!searched)
		return res.status(500).send({message: 'Faltan parametros en la peticion'});
	BlackList.findOne({'phone':searched},(err, founded) => {
		if(err)
			return res.status(500).send({message:'Error en la peticion'});
		if(!founded) return res.status(404).send({message: 'El numero no existe'});
		console.log(founded);
		return res.status(200).send({founded});
	})
}

module.exports = {
  test,
  saveInBlackList,
	isInBlackList
}
