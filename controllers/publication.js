'use require'

var mongoose = require('mongoose');
var mongoosePagination = require('mongoose-pagination')
var path = require('path');
var fs = require('fs');
var moment = require('moment')

//Modelos
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

//**Metodos
function test(req, res){
	res.status(200).send({message:'Publication test succesful'});
}
//Save Publication
function savePublication(req, res){
	var params = req.body;
	var userId = req.user.sub;

	if(!params.text)
		return res.status(200).send({message:'No hay texto!'});
	var publication = new Publication();
	publication.text = params.text;
	publication.file = 'null';
	publication.user = userId;
	publication.created_at = moment().unix();
	publication.save((err,publicationStored)=>{
		if(err) return res.status(500).send({message:'Error al hacer publicación'});
		if(!publicationStored )  return res.status(404).send({message:'Error: La publicacion no pudo ser almacenada'});
		return res.status(200).send({publication:publicationStored});
	});
}

function getPublications(req, res){
	var userId =  req.user.sub;
	console.log(userId);
	var page = 1;
	var itemsPerPage = 4;
	if(req.params.page)
		page = req.params.page;
	Follow.find({user:userId}).populate('followed').exec((err, follows)=>{
		if(err) return res.status(500).send({message:'Error al devolver seguimiento'});
		if(follows==0) return res.status(404).send({message:'No sigues a ningun usuario'});
		var cleanFollows  = [];
		follows.forEach((follow)=>{
			cleanFollows.push(follow.followed);
		});
		//Buscar sus publicaciones
		Publication.find({user: cleanFollows})
		.sort('-created_at')
		.populate('user')
		.paginate(page, itemsPerPage, (err, publications,total)=>{
			if(err) return res.status(500).send({message:'Error en peticion de publicaciones'});
			if(publications == 0) return res.status(404).send({message:'No hay publicaciones'});
			return res.status(200).send({
				total_items : total,
				pages : Math.ceil(total/itemsPerPage),
				publications
			});
		});
		//return res.status(200).send({cleanFollows});
	});
}

function getPublication(req, res){
	var publicationId = req.params.id; //id de la publicacion
	Publication.findById(publicationId, (err, publication) =>{
		if (err) return res.status(500).send({message:'Eror en la peticion'});
		if(publication == 0) return res.status(404).send({message:'No existe la publicacion'});
		return res.status(200).send({publication});
	});
}

function deletePublication(req, res){
	var publicationId = req.params.id;
	Publication.find({'user' : req.user.sub, '_id': publicationId}).remove ((err, publicationRemoved)=>{
		if(err) return res.status(500).send({message:'ERROR REMOVING PUBLICATION'});
		if(publicationRemoved == 0) return res.status(404).send({message:'No tienes permisos para eliminar esta publicacion'});
		return res.status(200).send({publication : publicationRemoved});
	});
}

function uploadImage(req, res){
	var publicationId = req.params.id;
	var userId = req.user.sub;
	if(req.files.image){
		var file_path = req.files.image.path;
		console.log(file_path);
		var file_split = file_path.split('/');
		console.log(file_split);
		var fileName = file_split[2];
		console.log(fileName);
		var ext_split = fileName.split('\.');
		console.log(ext_split);
		var fileExt = ext_split[1];
		if(fileExt == 'png'||fileExt == 'jpeg' || fileExt == 'jpg' || fileExt == 'gif'){
			Publication.findOne({'_id': publicationId}).exec((err,publication)=>{
				console.log(publication.user);
				if(err) return res.status(500).send({message:'ERROR FINDING PUBLICATION'});
				if(!publication) return res.status(404).send({message:'Publicacion no existente'});
				if(publication.user != userId) return removeFilesUpload(res, file_path, 'No tienes permisos de modificacion');
				return updateImage(res, publicationId, fileName);
			});
		}else {
			return removeFilesUpload(res, file_path, 'Extension no valida');
		}
	}else return res.status(200).send({message: 'No has adjuntado ningun archivo...'});
}

function updateImage (res, publicationId, fileName){
		Publication.findByIdAndUpdate(publicationId,{file: fileName},{new:true},(err, publicationUpdated) =>{
		if (err) return res.status(500).send({message:'Error en la peticion de actializacion'});
		if(!publicationUpdated) return res.status(404).send({message:'No se ha podido actualizar imagen en publicacion'});
		return res.status(200).send({publication:publicationUpdated});
	});
}
function removeFilesUpload(res, file_path, message){
	fs.unlink(file_path, (err) => {
		if(err) console.log(message+' Error: '+err);
		return res.status(500).send({ message : message});
	});
}

function getImagePublication(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/publications/' + imageFile;
	fs.exists(pathFile, (exists) => {
		if(exists) res.sendFile(path.resolve(pathFile));
		else res.status(200).send({message: 'No hay imagen'});
	});
}

module.exports = {
	test,
	savePublication,
	getPublications,
	getPublication,
	deletePublication,
	uploadImage,
	getImagePublication
}
