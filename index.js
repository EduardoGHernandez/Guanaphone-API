'use strict'

var mongoose =  require ('mongoose');
var app = require('./app');
var uriString= 'mongodb://guanahack:guanahack@ds229450.mlab.com:29450/heroku_7qm53lkv';
//var uriString = 'mongodb://heroku_h3hq9mht:Morita1234@ds159129.mlab.com:59129/heroku_h3hq9mht';
var port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.connect(uriString)
	.then(()=>{
		console.log("Conexion exitosa a DB");
		app.listen(port,()=>console.log("Listen in "+port+"..."))
	})
	.catch(err => {
		console.log("Error en la conexion de DB");
		console.log(uriString);
		console.log(port);
	});
