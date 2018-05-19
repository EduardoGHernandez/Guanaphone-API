'user strict'

var fs = require('fs');
var path = require('path')

function getImageUI(req, res){
	var imageFile = req.params.imageFile;
	console.log(imageFile);
	var pathFile = './uploads/ui/' + imageFile;
	fs.exists(pathFile, (exists) => {
		if(exists) res.sendFile(path.resolve(pathFile));
		else res.status(200).send({message: 'No hay imagen'});
	});
}

module.exports = {
  getImageUI
}
