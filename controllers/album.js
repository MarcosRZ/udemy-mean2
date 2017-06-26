'use strict'

var path = require('path');
var fs = require('fs');

var pagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require ('../models/song');

function getAlbum(req, res){

    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err){
            res.status(500).send({message: 'Error recuperando album'})
        } else {
            if (!album){
                res.status(404).send({message: 'No se ha encontrado el album'})
            } else {
                res.status(200).send({album})
            }
        }
    })

}

function getAlbums(req,res){
    var page = req.params.page || 1;
    var itemsPerPage = 3;

    Album.find().sort('name').paginate(page, itemsPerPage, (err, albums, total) => {
        if (err){
            res.status(500).send({message: 'Error recuperando albums'})
        } else {
            if (!albums){
                res.status(404).send({message: 'No se han encontrado album'})
            } else {
                res.status(200).send({total, page, albums})
            }
        }
    })
}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;

    // TODO: OJOOO

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {

        if (err){
            res.status(500).send({message: 'Error al guardar el album'})
        } else {
            if (!albumStored){
                res.status(404).send({message: 'No se ha guardado el album'})
            } else {
                res.status(200).send({album: albumStored})
            }
        }

    })
}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, updatedAlbum) => {
        if (err){
            res.status(500).send({message: 'Error al actualizar el album'});
        } else {
            if (!updatedAlbum){
                res.status(404).send({message: 'No se ha actualizado el album'});
            } else {
                res.status(200).send({album: updatedAlbum});
            }
        }
    })
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, removed) => {
                
        if (err){
            res.status(500).send({message: 'Error al borrar el album'});
        } else {
            if (!removed){
                res.status(404).send({message: 'No se ha borrado el album'});
            } else {
                
                Song.find({album: removed._id}).remove((err, songRemoved) => {
                    if (err){
                        res.status(500).send({message: 'Error borrando la cancion'})
                    } else {
                        if (!songRemoved){
                            res.status(404).send({message: 'No se ha borrado la cancion'})
                        } else {
                            res.status(200).send({album: removed})
                        }
                    }
                })
            }
        }
    })
}


function uploadImage(req, res){
    var albumId = req.params.id;

    var file_name = 'No subido...';

    if (req.files){
        var file_path = req.files.image.path;
        var path_split = file_path.split('\/');
        var file_name = path_split[2]
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, updatedAlbum) => {
            if (err){
                res.status(500).send({message: 'Error al actualizar el album'})
            } else {
                if (!updatedAlbum){
                    res.status(404).send({message: 'Error al actualizar el allbum'})
                } else {
                    res.status(200).send({album: updatedAlbum});
                }
            }
            });
        }

    } else {
        res.status(200).send({message: 'No has subido ninguna imagen'})
    }
}

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var imagePath = './uploads/albums/' + imageFile;

    fs.exists(imagePath, (exists) => {
        if (exists){
            res.sendFile(path.resolve(imagePath));
        } else{
            res.status(404).send({message: 'La imagen no existe...'})
        }
    })
}

module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}