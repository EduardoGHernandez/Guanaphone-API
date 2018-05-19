'use strict'

//Cargar modelo
var Campaign = require('../models/campaign');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path')

//Metodos de prueba
function test(req, res){
	res.status(200).send({
		message: 'campaign test'
	});
}
//Nueva campaña
//Registro
function saveCampaign(req, res){
	console.log("Nueva campaña...");
	var params = req.body;
	var campaign = new Campaign();
	if(params.name &&
    params.image &&
    params.age &&
    params.city &&
    params.state&&
    params.expire_date&&
    params.blood_type&&
    params.contact_name&&
    params.phone&&
    params.hospital&&
    params.bed&&
    params.room&&
    params.num_donators){
		campaign.name = params.name;
		campaign.image = 'default1.png';
    campaign.age = params.age;
    campaign.city = params.city;
    campaign.state = params.state;
    campaign.expire_date = params.expire_date;
    campaign.blood_type = params.blood_type;
    campaign.contact_name = params.contact_name;
    campaign.phone = params.phone;
    campaign.hospital = params.hospital;
    campaign.bed = params.bed;
    campaign.room = params.room;
    campaign.num_donators = params.num_donators;
		//Control de usuarios duplicados pendiente
		console.log("Nueva campaña...");
		campaign.save((err, userStored) => {
  		if(err) return res.status(500).send({message: 'Error al guardar usuario'});
  		if(userStored){
  			console.log("Espera...");
  			return res.status(200).send({user : userStored});
  			console.log("...listo");
  		}else{
  			return res.status(404).send({message: 'No se ha registrado al usuario'});
  		}
		});
	}else{
		res.status(500).send({
			message: 'Envia todos los campos necesarios'
		});
	}
}

function getCampaigns(req, res){
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 20;

	Campaign.find().sort('_id').paginate(page, itemsPerPage, (err, campaigns, total)=>{
		if(err) return res.status(500).send({message : 'Error en paginado de usuarios'});
		if(!campaigns) return res.status(404).send({message: 'No hay usuarios disponibles'});
		return res.status(200).send({
			campaigns,
			total,
			pages:Math.ceil(total/itemsPerPage)
		})
	});
}

module.exports ={
  test,
  saveCampaign,
	getCampaigns
}
