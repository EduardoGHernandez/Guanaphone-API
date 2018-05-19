'use strict'

var express =  require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var api_routes = require('./routes/api');

//Middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Cors & Configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//Rutas
app.use('/api', api_routes);

app.get('/', (req,res)=>{
	res.status(200).send({
		message: 'Hola mundo'
	});
});

//Exportar
module.exports = app;

