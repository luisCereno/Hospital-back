var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

//Importar modelo de hospital
var Hospital = require('../models/hospital');

//============================================================== 
// Obtener todos los hospitales
//============================================================== 
app.get('/', (req, res, next) => {

    Hospital.find({}, 'nombre img')
        .exec( (err, hospitales) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                mensaje: 'Error, cargando hospital',
                errors: err

            });
            
        }

        res.status(200).json({

            ok: true,
            hospitales: hospitales
    
        });

    });

});

//============================================================== 
// Actualizar hospital
//============================================================== 
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err

            });
            
        }

        if (!hospital) {
            
            if (err) {

                return res.status(400).json({
    
                    ok: false,
                    mensaje: 'El hospital con el id: '+ id + ' no existe',
                    errors: {message: 'No existe hospital con ese ID'}
    
                });
                
            }

        }

        hospital.nombre = body.nombre;

        hospital.save((err, hospitalGuardado) => {

            if (err) {

                return res.status(400).json({
    
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
    
                });
                
            }

            res.status(200).json({

                ok: true,
                hospital: hospitalGuardado
        
            });

        });

    });

});

//============================================================== 
// Crear hospital
//============================================================== 
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({

        nombre: body.nombre,
        usuario: req.usuario.id

    });

    //guardar hospital
    hospital.save((err, hospitalGuardado) => {

        if (err) {

            return res.status(400).json({

                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err

            });
            
        }

        res.status(201).json({

            ok: true,
            hospital: hospitalGuardado,
            hospitalToken: req.hospital 
    
        });

    });

});

//============================================================== 
// Borrar hospital
//============================================================== 
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err

            });
            
        }

        if (!hospitalBorrado) {

            return res.status(400).json({

                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: {message: 'No existe un hospital con ese id'}

            });
            
        }

        res.status(200).json({

            ok: true,
            hospital: hospitalBorrado
    
        });

    })
});

module.exports = app;