'use strict'

var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando...'
    })
}

function saveUser(req,res){

    var user = new User();

    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password){
        // Cifrar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err,hash){
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null){
                // Guardar usuario
                user.save((err, userStored) => {
                    if (err){
                        res.status(500).send({message: 'Error al guardar el usuario'})
                    } else {
                        if (!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'})
                        } else {
                            res.status(200).send({user: userStored})
                        }
                    }
                })
            } else {
                res.status(200).send({message: 'Faltan datos en la solicitud'});
            }
        })
    } else {
        res.status(500).send({message: 'Introduce la contraseña'})
    }
}

function login(req, res){

    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err){
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!user){
                res.status(404).send({message: 'El usuario no existe'});
            } else {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check){
                        // devolver los datos del usuario logueado
                        if (params.gethash){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: 'Login incorrecto'});
                    }
                });
            }
        }
    });

}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: "No tienes permiso para actualizar este usuario."});
    }

    console.log(update)
    User.findByIdAndUpdate(userId, update, (err, updatedUser) => {
        if (err){
            res.status(500).send({message: 'Error al actualizar el usuario'})
        } else {
            if (!updatedUser){
                res.status(404).send({message: 'Error al actualizar el usuario'})
            } else {
                res.status(200).send({user: updatedUser});
            }
        }
    })

}

function uploadImage(req, res){
    var userId = req.params.id;

    var file_name = 'No subido...';

    if (req.files){
        var file_path = req.files.image.path;
        var path_split = file_path.split('\/');
        var file_name = path_split[2]
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, updatedUser) => {
            if (err){
                console.log('Error al actualizar el usuario')
                res.status(500).send({message: 'Error al actualizar el usuario'})
            } else {
                if (!updatedUser){
                    console.log("Error al actualizar el usuario")
                    res.status(404).send({message: 'Error al actualizar el usuario'})
                } else {
                    console.log({image: file_name, user: updatedUser})
                    res.status(200).send({image: file_name, user: updatedUser});
                }
            }
            });
        }

    } else {
        console.log("FUCK!")
        res.status(200).send({message: 'No has subido ninguna imagen'})
    }
}

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var imagePath = './uploads/users/' + imageFile;

    fs.exists(imagePath, (exists) => {
        if (exists){
            res.sendFile(path.resolve(imagePath));
        } else{
            res.status(404).send({message: 'La imagen no existe...'})
        }
    })
}



module.exports = {

    pruebas,
    saveUser,
    updateUser,
    login,
    uploadImage,
    getImageFile

};