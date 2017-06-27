'use strict'

var express = require('express');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});
var SongController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/authentication');

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:albumId?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-file-song/:file', SongController.getSongFile);

module.exports = api; 