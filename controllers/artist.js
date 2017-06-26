'use strict'

var path = require('path');
var fs = require('fs');

var pagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require ('../models/song');

function getArtist(req, res){

    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err){
            res.status(500).send({message: 'Error recuperando artista'})
        } else {
            if (!artist){
                res.status(404).send({message: 'No se ha encontrado el artista'})
            } else {
                res.status(200).send({artist})
            }
        }
    })

}

function getArtists(req,res){
    var page = req.params.page || 1;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err){
            res.status(500).send({message: 'Error recuperando artistas'})
        } else {
            if (!artists){
                res.status(404).send({message: 'No se han encontrado artistas'})
            } else {
                res.status(200).send({total, page, artists})
            }
        }
    })
}

function saveArtist(req, res){
    var artist = new Artist();

    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {

        if (err){
            res.status(500).send({message: 'Error al guardar el artista'})
        } else {
            if (!artistStored){
                res.status(404).send({message: 'No se ha guardado el artista'})
            } else {
                res.status(200).send({artist: artistStored})
            }
        }

    })
}

function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, updatedArtist) => {
        if (err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        } else {
            if (!updatedArtist){
                res.status(404).send({message: 'No se ha actualizado el artista'});
            } else {
                res.status(200).send({artist: updatedArtist});
            }
        }
    })
}

function deleteArtist(req, res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, removed) => {
                
        if (err){
            res.status(500).send({message: 'Error al borrar el artista'});
        } else {
            if (!removed){
                res.status(404).send({message: 'No se ha borrado el artista'});
            } else {

                Album.find({artist: removed._id}).remove((err, albumRemoved) => {
                    if (err){
                        res.status(500).send({message: 'Error borrando el album'})
                    } else {
                        if (!albumRemoved){
                            res.status(404).send({message: 'No se ha borrado el album'})
                        } else {
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if (err){
                                    res.status(500).send({message: 'Error borrando la cancion'})
                                } else {
                                    if (!songRemoved){
                                        res.status(404).send({message: 'No se ha borrado la cancion'})
                                    } else {
                                        res.status(200).send({artist: removed})
                                    }
                                }
                            })
                        }
                    }
                })

                res.status(200).send({artist: removed});
            }
        }
    })
}

function uploadImage(req, res){
    var artistId = req.params.id;

    var file_name = 'No subido...';

    if (req.files){
        var file_path = req.files.image.path;
        var path_split = file_path.split('\/');
        var file_name = path_split[2]
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, updatedArtist) => {
            if (err){
                res.status(500).send({message: 'Error al actualizar el artista'})
            } else {
                if (!updatedArtist){
                    res.status(404).send({message: 'Error al actualizar el artista'})
                } else {
                    res.status(200).send({artist: updatedArtist});
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
    var imagePath = './uploads/artists/' + imageFile;

    fs.exists(imagePath, (exists) => {
        if (exists){
            res.sendFile(path.resolve(imagePath));
        } else{
            res.status(404).send({message: 'La imagen no existe...'})
        }
    })
}

module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}