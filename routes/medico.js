var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

//Importar modelo de medico
var Medico = require('../models/medico');

//============================================================== 
// Obtener todos los medicos
//============================================================== 
app.get('/', (req, res, next) => {

    Medico.find({}, 'nombre img')
        .exec( (err, medicos) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                mensaje: 'Error, cargando medicos',
                errors: err

            });
            
        }

        res.status(200).json({

            ok: true,
            medicos: medicos
    
        });

    });

});

//============================================================== 
// Actualizar medico
//============================================================== 
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err

            });
            
        }

        if (!medico) {
            
            if (err) {

                return res.status(400).json({
    
                    ok: false,
                    mensaje: 'El medico con el id: '+ id + ' no existe',
                    errors: {message: 'No existe medico con ese ID'}
    
                });
                
            }

        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {

                return res.status(400).json({
    
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
    
                });
                
            }

            res.status(200).json({

                ok: true,
                medico: medicoGuardado
        
            });

        });

    });

});

//============================================================== 
// Crear medico
//============================================================== 
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({

        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    //guardar medico
    medico.save((err, medicoGuardado) => {

        if (err) {

            return res.status(400).json({

                ok: false,
                mensaje: 'Error al crear medico',
                errors: err

            });
            
        }

        res.status(201).json({

            ok: true,
            medico: medicoGuardado,
            medicoToken: req.medico 
    
        });

    });

});

//============================================================== 
// Borrar medico
//============================================================== 
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err

            });
            
        }

        if (!medicoBorrado) {

            return res.status(400).json({

                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: {message: 'No existe un medico con ese id'}

            });
            
        }

        res.status(200).json({

            ok: true,
            medico: medicoBorrado
    
        });

    })
});

module.exports = app;