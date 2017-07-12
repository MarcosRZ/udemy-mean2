import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService, UploadService]
})

export class AlbumAddComponent implements OnInit{

    public titulo: string;
    public album: Album;

    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ){
        this.titulo = 'Crear nuevo album';
        this.album = new Album('','',2017,'','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        console.log("AlbumAddComponent cargado.")

        // Sacamos el id de artista de la URL
        this._route.params.subscribe(params => {
            this.album.artist = params['artist'];
        })
    }

    onSubmit(){

        this._albumService.addAlbum(this.token, this.album)
            .subscribe(
                response => {

                    if (!response.album){
                        this.alertMessage = 'Error al añadir album';
                    } else {
                        this.alertMessage = 'Album creado satisfactoriamente';
                        this.album = response.artist;
                        this._router.navigate(['/editar-album', response.album._id]);
                    }
                },
                error => {
                    if (error != null){
                        this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        this.alertMessage = 'Error desconocido al crear el album';
                    }
                }
            )
        console.log(this.album);
    }

}  