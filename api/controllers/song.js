'use strict'

var path = require('path');
var fs = require('fs');

var pagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require ('../models/song');

function getSong (req, res){

    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if (err){
            res.status(500).send({message: 'Error recuperando cancion'})
        } else {
            if (!song){
                res.status(404).send({message: 'No se ha encontrado la cancion'})
            } else {
                res.status(200).send({song})
            }
        }
    })
}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;

    song.number = params.number;
    song.duration = params.duration;
    song.name = params.name;
    song.album = params.album;
    song.file = null;

    song.save((err, stored) => {

        if (err){
            res.status(500).send({message: 'Error al guardar la cancion'})
        } else {
            if (!stored){
                res.status(404).send({message: 'No se ha guardado la cancion'})
            } else {
                res.status(200).send({stored: stored})
            }
        }
    })
}

function getSongs(req,res){

    var albumId = req.params.album;

    var page = req.params.page || 1;
    var itemsPerPage = 3;

    var query = {};

    if (albumId){
        query = {album: albumId}
    }

    Song.find(query)
    .sort('number')
    .populate(
        {
            path: 'album',
            populate: {
                path: 'artist',
                model: 'Artist'
            }
        }
    ).exec((err, items) => {
         if (err){
            res.status(500).send({message: 'Error recuperando canciones'})
        } else {
            if (!items){
                res.status(404).send({message: 'No se han encontrado canciones'})
            } else {
                res.status(200).send({items})
            }
        }
    })
    
    /*.paginate(page, itemsPerPage, (err, items, total) => {
        if (err){
            res.status(500).send({message: 'Error recuperando canciones'})
        } else {
            if (!items){
                res.status(404).send({message: 'No se han encontrado canciones'})
            } else {
                res.status(200).send({total, page, items})
            }
        }
    })*/
}

function updateSong (req, res){
    var songId = req.params.id

    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, updated) => {
        if (err){
            res.status(500).send({message: 'Error al actualizar la cancion'});
        } else {
            if (!updated){
                res.status(404).send({message: 'No se ha actualizado la cancion'});
            } else {
                res.status(200).send({updated});
            }
        }
    })
}

function deleteSong (req, res) {

    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, removed) => {
        if (err){
            res.status(500).send({message: 'Error al borrar la cancion'});
        } else {
            if (!removed){
                res.status(404).send({message: 'No se ha borrado la cancion'});
            } else {
                res.status(200).send({removed});
            }
        }
    })
}

function uploadFile(req, res){
    var songId = req.params.id;

    var file_name = 'No subido...';
        console.log(req.files)
    if (req.files){
        var file_path = req.files.file.path;
        var path_split = file_path.split('\/');
        var file_name = path_split[2]
        var file_ext = file_name.split('.')[1];

        console.log(req.files)

        if (file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, updated) => {
            if (err){
                res.status(500).send({message: 'Error al actualizar la cancion'})
            } else {
                if (!updated){
                    res.status(404).send({message: 'Error al actualizar la cancion'})
                } else {
                    res.status(200).send({updated});
                }
            }
            });
        }

    } else {
        res.status(200).send({message: 'No has subido ningun fichero'})
    }
}

function getSongFile(req, res){

    var songFile = req.params.file;
    var songPath = './uploads/songs/' + songFile;

    fs.exists(songPath, (exists) => {
        if (exists){
            res.sendFile(path.resolve(songPath));
        } else{
            res.status(404).send({message: 'El fichero no existe...'})
        }
    })
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}