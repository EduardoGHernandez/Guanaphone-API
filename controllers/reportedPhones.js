'use strict'

//Cargar modelos

var ReportedPhones = require('../models/reportedPhones');

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
		message: 'reportedPhones test'
	});
}

function saveInReportedPhones(req, res){
  var params = req.body;
  var reportedPhones = new ReportedPhones();
  console.log(req.body);
  if(!params.phoneE || !params.phoneV || !params.audio || !params.text || !params.category)
    return res.status(500).send({message: 'Error al guardar en reportedPhones: Faltan parametros'});
  reportedPhones.phoneE = params.phoneE;
  reportedPhones.phoneV = params.phoneV;
  reportedPhones.audio = params.audio;
  reportedPhones.text = params.text;
  reportedPhones.category = params.category;

  console.log("Guardando: " + reportedPhones.phoneE);
  reportedPhones.save((err, userStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar en reportedPhones'});
						if(userStored){
							console.log("Legen... Wait for it...");
							return res.status(200).send({user : userStored});
							console.log("...dary");
						}else{
							return res.status(404).send({message: 'No se ha registrado en reportedPhones'});
						}
					});
}

module.exports = {
  test,
  saveInReportedPhones
}