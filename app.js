'use strict'

var express =  require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var blackList_routes = require('./routes/blackList');
var reportedPhones_routes = require('./routes/reportedPhones')

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
app.use('/api', blackList_routes);
app.use('/api', reportedPhones_routes)

app.get('/', (req,res)=>{
	res.status(200).send({
		message: 'Las Lolis #GuanaHacks'
	});
});

//Exportar
module.exports = app;
