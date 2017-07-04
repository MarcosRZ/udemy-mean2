import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist'

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{

    public titulo: string;
    public artist: Artist;
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
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ){
        this.titulo = 'Actualizar Artista';
        this.artist = new Artist('','','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.isEdit = true;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id)
            .subscribe(
                response => {
                    if (!response.artist){
                        this._router.navigate(['/'])
                    } else {
                        console.log(response.artist)
                        this.artist = response.artist;
                    }
                },
                error => {
                    if (error != null){
                        //this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        console.log('Error desconocido al crear el artista');
                    }     
                }
            )
        })
    }

    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.updateArtist(this.token, id, this.artist)
            .subscribe(
                response => {

                    if (!response.artist){
                        this.alertMessage = 'Error al editar artista';
                    } else {
                        this.alertMessage = 'Artista actualizado satisfactoriamente';
                        // Subir la imagen de artista
                        this._uploadService.makeFileRequest(this.url + '/upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                result => {
                                    this._router.navigate(['/artists', 1])
                                },
                                error => {
                                    console.log(error)
                                }
                            )
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
        });
    }

    public fileChangeEvent(fileInput : any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}