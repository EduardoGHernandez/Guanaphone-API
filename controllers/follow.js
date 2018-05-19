'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function test(req, res){
	return res.status(200).send({message:'Test follows controller'});
}

function saveFollow(req, res){
	var params = req.body;
	if(params.followed  == req.user.sub) return res.status(200).send({message:'En serio quieres seguirte a ti mismo?'});

	var follow =  new Follow();

	follow.user = req.user.sub;
	follow.followed = params.followed;
	//console.log(follow.user+' '+follow.followed);
	follow.save((err, followStored)=>{
		if(err) return res.status(500).send({message: 'Error en follow'});
		if(!followStored) return res.status(404).send({message:'No se pudo guardar follow'});
		return res.status(200).send({follow:followStored});
	});
	//Falta implementar verificacion de duplicados
}

function deleteFollow(req, res){
	var userId = req.user.sub;
	var followId = req.params.id;
	Follow.find({'user': userId, 'followed':followId }).remove(err =>{
		if (err) return res.status(500).send({message:'Error en unfollow'});
		return res.status(200).send({message:'Unfollowed'});
	})
}

function getUsersFollowed(req, res){
	var userId = req.user.sub; //Usuario por token
	if(req.params.id)
		userId = req.params.id;
	var page = 1;
	if(req.params.page)
		page = req.params.page;
	var itemsPerPage = 10;

	Follow.find({ user : userId}).populate({path:'followed'}).paginate(page, itemsPerPage,(err, follows, total)=>{
	//	console.log(err);
		if(err) return res.status(500).send({message:'Error en peticion'});
		if(follows==0) return res.status(404).send({message:'There arent  users followed'});
		return res.status(200).send({total: total, pages: Math.ceil(total/itemsPerPage), follows});
	});
}

function getUsersFollowingMe(req, res){
	var userId = req.user.sub;
	var itemsPerPage = 4;
	var page = 1;
	if(req.params.page)
		page = req.params.page;
	Follow.find({followed:userId}).populate({path:'user followed'}).paginate(page, itemsPerPage,(err, follows, total)=>{
		//console.log(err);
		if(err) return res.status(500).send({message:'Error en la peticion'});
		if(follows==0) return res.status(404).send({message:'Anybody follows you'});
                return res.status(200).send({total: total, pages: Math.ceil(total/itemsPerPage), follows});
	});
}
//A quienes sigo o quienes me siguen
function getMyFollows(req, res){
	var userId = req.user.sub;

	var find = Follow.find({user:userId}).populate({path: 'followed'});
        if(req.params.followed)
                find = Follow.find({followed:userId}).populate({path: 'user'});


        find.exec((err, follows)=>{
		if(err) return res.status(500).send({message:'Error en la peticion'});
		if(follows==0) return res.status(404).send({message:'No hay usuarios'});
                return res.status(200).send({follows});
	});
}

module.exports = {
	test,
	saveFollow,
	deleteFollow,
	getUsersFollowed,
	getUsersFollowingMe,
        getMyFollows
}
