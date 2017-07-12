import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{

    public titulo: string;
    public album: Album;
    public albumId: string;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public isEdit: boolean;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ){
        this.titulo = 'Actualizar Album';
        this.album = new Album('','',2017,'','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.isEdit = true;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        console.log("AlbumEditComponent cargado.")

        this.getAlbum();
        // Sacamos el id de artista de la URL
       
    }

    getAlbum(){
        this._route.params.subscribe(params => {
            this.albumId = params['album'];

            this._albumService.getAlbum(this.token, this.albumId)
                .subscribe(
                    response => {
                        if (!response.album){
                             this._router.navigate(['/'])
                        } else {
                            console.log(response.album)
                            this.album = response.album;
                        }
                    },
                    error => {
                        if (error != null){
                            console.log(error)
                        }
                    }
                )
        })
    }

    onSubmit(){

        this._albumService.updateAlbum(this.token, this.albumId, this.album)
            .subscribe(
                response => {

                    if (!response.album){
                        this.alertMessage = 'Error al actualizar album';
                    } else {
                        this.alertMessage = 'Album actualizado satisfactoriamente';
                        if (this.filesToUpload){
                            this._uploadService.makeFileRequest(this.url + '/upload-image-album/' + this.albumId, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    result => {
                                        console.log('Imagen actualizada correctamente.')
                                        //this._router.navigate(['/album', response.album.artist])
                                    },
                                    error => {
                                        console.log(error)
                                        console.log(this.filesToUpload)
                                    }
                                )
                            
                            console.log('/editar-album/' + response.album._id)
                        }
                    }
                },
                error => {
                    if (error != null){
                        this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        this.alertMessage = 'Error desconocido al actualizar el album';
                    }
                }
            )

    }

    public fileChangeEvent(fileInput : any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}  