var express = require('express');

var app = express();

//Exportar modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//============================================================== 
// Busqueda general
//============================================================== 
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    //Expresion regular para volver 'busqueda' insensible a las mayusculas
    var regex = new RegExp(busqueda, 'i');

    Promise.all([

        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)

    ]).then(respuestas => {
        
        res.status(200).json({
    
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
    
        });

    });

});

function buscarHospitales(busqueda, regex){

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    
                    reject('Error al cargar hospital', err);

                }else {

                    resolve(hospitales);

                }
            
            });

    });

}

function buscarMedicos(busqueda, regex){

    return new Promise((resolve, reject) => {

        Medico.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    
                    reject('Error al cargar medico', err);

                }else {

                    resolve(medicos);

                }
            
            });

    });

}

function buscarUsuarios(busqueda, regex){

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{'nombre': regex}, {'email': regex}])
            .exec((err, usuarios) => { 

                if (err) {
                    
                    reject('Error al cargar medico', err);

                }else {

                    resolve(usuarios);

                }
                
            });

    });

}

module.exports = app;