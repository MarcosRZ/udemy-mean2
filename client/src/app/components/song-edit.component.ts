import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }   from '../services/global';
import { Song } from '../models/song';


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{

    public isEdit: boolean;
    public song: Song;
    public songId: string;
    public titulo: string;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public filesToUpload: File[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ){
        this.isEdit = true;
        this.titulo = 'Modificar Canción';
        this.song = new Song(1,'','','','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        console.log("SongAddComponent cargado.")

        this._route.params.subscribe(params => {
            this.songId = params['id'];
            this.getSong(this.songId);
        })


    }

    getSong(songId){
        this._songService.getSong(this.token, songId)
        .subscribe(
            response => {
                if (!response.song){
                    this._router.navigate(['/'])
                } else {
                    this.song = response.song;
                    console.log(this.song);
                }
            },
            error => {
                if (error != null){
                    this.alertMessage = JSON.parse(error._body).message;
                    console.log(error)
                } else {
                    this.alertMessage = 'Error desconocido al recuperar la canción';
                }
            }
        )
    }

    onSubmit(){

        console.log(this.song)

        this._songService.updateSong(this.token, this.songId, this.song)
        .subscribe(
            response => {

                    if (!response.song){
                        this.alertMessage = 'Error al editar la cancion';
                    } else {
                        this.alertMessage = 'Cancion actualizado satisfactoriamente';
                        // Subir la imagen de artista

                        if (this.filesToUpload){

                            this._uploadService.makeFileRequest(this.url + '/upload-file-song/' + this.songId, [], this.filesToUpload, this.token, 'song')
                            .then(
                                result => {
                                    console.log('/album/' + this.song.album)
                                    this._router.navigate(['/album', response.song.album])
                                },
                                error => {
                                    console.log(error)
                                }
                            )
                        } else {
                            this._router.navigate(['/editar-cancion', this.songId]);
                        }
                    }
                },
                error => {
                    if (error != null){
                        this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        this.alertMessage = 'Error desconocido al actualizar el artista';
                    }
                }
        )

    }

    public fileChangeEvent(fileInput : any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}  