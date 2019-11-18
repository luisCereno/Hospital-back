var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

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
        
        res.status(200).json({
    
            ok: true,
            mensaje: 'Peticion realizada correctamente',
            extensionArchivo: extensionArchivo
    
        });

    });

});

module.exports = app;