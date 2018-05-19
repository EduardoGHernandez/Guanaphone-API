'use strict'

//Cargar modelos

var BlackList = require('../models/blackList');
var Dangerous = require('../models/dangerous');

//
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path')

//Metodos de prueba
function home(req, res){
	res.status(200).send({
		message: 'User home test'
	});
}

function test(req, res){
	console.log(req.body);
	res.status(200).send({
		message: 'Second test'
	});
}

function audioToText(audio) {
	var text = "text successfully"
	return text;
}


//Registro
function saveInBlackList(req, res){
	var params = req.body;
	var blackList = new BlackList();
	/*if(params.name && params.surname && params.nickname &&
	   params.email && params.password){
		user.name = params.name;
		user.surname = params.surname;
		user.nickname = params.nickname;
		user.email = params.email
		user.role = 'ROLE_USER';
		user.image = null;
*/
	blackList.number = params.number;
	blackList.audio = params.audio;
	//blackList.text = audioToText(params.audio);
	blackList.type = params.type;
	res.status(200).send({
		message: 'Success'
	});
	}
}


//Inicio de sesion
function loginUser(req, res){
	var params = req.body;
	var email =  params.email;
	var password = params.password;
	User.findOne({
		 email: email
	}, (err, user) => {
		if(err) return res.status(500).send({message : 'Error en la peticion'});
		if(user){
			bcrypt.compare(password, user.password, (err, check) => {
				if(check){
					if(params.gettoken){
						//Devolver token & Generar token
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
					//Devolver datos
						user.password = undefined;
						console.log(user.nickname+" ha iniciado sesion");
						return res.status(200).send({user});
					}
				}else{
					return res.status(404).send({message: 'El usuario no se ha podido loggear'});
				}
			});
		}else{
			return res.status(404).send({message: 'El usuario no se ha podido identificar'});
		}
	});
}

//Conseguir datos de usuario y saber si lo sigo
function getUser(req, res){
	var userId =  req.params.id;
	User.findById(userId, (err,user)=>{
		//console.log(err);
		if(err) return res.status(500).send({message:'Error en la peticion'});
		if(!user) return res.status(404).send({message: 'El usuario no existe'});
		user.password = undefined;
		followThisUser(req.user.sub, userId).then((value) => {
			return res.status(200).send({user, value});
		});
	});
}

async function followThisUser(identity_user_id, user_id){
//	console.log(identity_user_id+' '+ user_id);
	try{
		var following = await  Follow.findOne({'user':identity_user_id, 'followed':user_id}).exec().then((follow)=>{
			return follow
		}).catch((e)=> {
			console.log(e);
		});
		var followed = await Follow.findOne({'user':user_id,'followed':identity_user_id}).exec().then((follow)=>{
			return follow
		}).catch((e)=>{
			 console.log(e);
		});
		return {following: following, followed:followed}
	}catch(e){
		console.log(e);
	}
}

//Devolver un listado de usuarios que sigo & que me siguen
async function followUsersIds(user){
	var following = await Follow.find({'user':user}).select({'_id':0, '__v':0,'user':0}).exec().then((follows)=>{
		var cleanFollows = [];
		follows.forEach((follow)=>{
			cleanFollows.push(follow.followed);
		})
		return cleanFollows;
	}).catch((e)=>{
		console.log(e);
	});
	var followed = await Follow.find({'followed':user}).select({'_id':0,'__v':0,'followed':0}).exec().then((follows)=>{
		var cleanFollows = [];
		follows.forEach((follow)=>{
			cleanFollows.push(follow.user);
		})
		return cleanFollows;
	}).catch((e)=>{
		return console.log(e);
	})

	return({following:following, followed:followed});
}

function getUsers(req, res){
	var identityUserId = req.user.sub;

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 6;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
		if(err) return res.status(500).send({message : 'Error en paginado de usuarios'});
		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});
		followUsersIds(identityUserId).then((value)=>{
			return res.status(200).send({
				users,
				users_following: value.following,
				users_followed: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)
			});
		});

	});

}

function updateUser(req, res){
	console.log("test");
	var userId = req.params.id;
	var update = req.body;
	var duplicated = false;
	console.log("Actualizando...");
	//Borrar propiedad password
	delete update.password;
	if(userId!=req.user.sub)
		return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'});
	//Verificar que otro usuario no este usando ese correo
	User.findOne({'email': update.email}).exec((error, user) => {
		if(!user || userId == user._id){
			//{new:true} -> Para que devuelva el objeto actualizado
			User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
				if(err) return res.status(500).send({message:'Error al actualizar datos'});
				if(!userUpdated) res.status(404).send({message: 'No se ha podido actualizar el usuario: '+ user});
				return res.status(200).send({userUpdated});
			});
		}else
			return res.status(500).send({message:'Ya existe un usuario con este correo electronico'});
	});
}

//Subir archivos de imagen

function uploadImage(req, res){
	var userId = req.params.id;

	if(req.files){
		var file_path = req.files.image.path;
		console.log(file_path);
		var file_split = file_path.split('/');
		console.log(file_split);
		var fileName = file_split[2];
		console.log(fileName);
		var ext_split = fileName.split('\.');
		console.log(ext_split);
		var fileExt = ext_split[1];
		if(userId!=req.user.sub) return removeFilesUpload(res, file_path, 'No tienes permisos de modificación');
		if(fileExt == 'png'||fileExt == 'jpeg' || fileExt == 'jpg' || fileExt == 'gif'){
			//Actualizar avatar de usuario
			User.findByIdAndUpdate(userId,{image: fileName},{new:true},(err, userUpdated) =>{
				if (err) return res.status(500).send({message:'Error en la peticion'});
				if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar avatar'});
				return res.status(200).send({user:userUpdated});
			});
		}else {
			return removeFilesUpload(res, file_path, 'Extension no valida');
		}
	}else return res.status(200).send({message: 'No has adjuntado ningun archivo...'});
}

function removeFilesUpload(res, file_path, message){
	fs.unlink(file_path, (err) => {
		if(err) console.log(message+' Error: '+err);
		return res.status(500).send({ message : message});
	});
}

function getImageUser(req, res){
	var imageFile = req.params.imageFile;
	console.log(imageFile);
	var pathFile = './uploads/users/' + imageFile;
	fs.exists(pathFile, (exists) => {
		if(exists) res.sendFile(path.resolve(pathFile));
		else res.status(200).send({message: 'No hay imagen'});
	});
}

function getCounters(req, res){
	if(req.params.id){
		getCountFollows(req.params.id).then((value)=>{
			return res.status(200).send({value});
		}).catch((err) => {
			return handleerror(err);
		});
	}else
		getCountFollows(req.user.sub).then((value)=>{
			return res.status(200).send({value});
		}).catch((err)=>{
			return handleerror(err);
		});
}

async function getCountFollows(userId){
	var following = await Follow.count({'user':userId}).exec().then((count)=>{
		return count;
	}).catch((e)=>{
		return handleerror(e);
	});
	var followed = await Follow.count({'followed':userId}).exec().then((count)=>{
		return count;
	}).catch((e)=>{
		return handleerror(e);
	})
	var publications = await Publication.count({'user':userId}).exec().then((count)=>{
		return count;
	}).catch((e)=>{
		return handleerror(e);
	});

	return {
		following : following,
		followed : followed,
		publications: publications
	}
}

module.exports = {
	home,
	test,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage,
	getImageUser,
	getCounters
}
