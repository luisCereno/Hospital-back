var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

//Modelo
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/medico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf( tipo ) < 0) {

        return res.status(400).json({

            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            error: { message: 'Los tipos colecciones validas son ' + tiposValidos.join(', ') }

        });
        
    }

    //Revisa si el usuario ha seleccionado algun archivo
    if (!req.files) {

        return res.status(400).json({

            ok: false,
            mensaje: 'No ha seleccionado nada',
            error: { message: 'Debe seleccionar una imagen' }

        });
        
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    //Separa el nombre por '.' y mete en arreglo 
    var nombreCortado = archivo.name.split('.');
    //Selecciona el ultimo objeto del arreglo
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Extensiones permitidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({

            ok: false,
            mensaje: 'Extension no valida',
            error: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }

        });
        
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {

        if (err) {

            return res.status(400).json({

                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
    
            });
            
        }
        
        subirPorTipo( tipo, id, nombreArchivo, res); 

    });

});

//============================================================== 
// Funcion para subir imagenes por tipo de colecciones
//============================================================== 
function subirPorTipo( tipo, id, nombreArchivo, res) {

    //============================================================== 
    // Subir por tipo usuarios
    //============================================================== 
    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlinkSync(pathViejo);
                
            }

            //Se almacena nombre de la img
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado

                });

            });

        });
        
    }

    //============================================================== 
    // Subir por tipo medicos
    //============================================================== 
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            var pathViejo = './uploads/medicos/' + medico.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlinkSync(pathViejo);
                
            }

            //Se almacena nombre de la img
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado

                });

            });

        });
        
    }

     //============================================================== 
    // Subir por tipo hospitales
    //============================================================== 
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlinkSync(pathViejo);
                
            }

            //Se almacena nombre de la img
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen del hospital actualizada',
                    hospital: hospitalActualizado

                });

            });

        });
        
    }

}

module.exports = app;