import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{

    public album: Album;
    public songs: Song[];
    public identity;
    public token;
    public url: string;
    public alertMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ){
        this.album = new Album('', '',2017, null,'')
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id)
            .subscribe(
                response => {
                    if (!response.album){
                        this._router.navigate(['/'])
                    } else {
                        console.log(response.album)
                        this.album = response.album;

                        this._songService.getSongs(this.token, response.album._id)
                            .subscribe(
                                response => {
                                    this.songs = response.items
                                    console.log(this.songs);
                                },
                                error => {
                                    if (error != null){
                                        //this.alertMessage = JSON.parse(error._body).message;
                                        console.log(error)
                                    } else {
                                        console.log('Error desconocido obteniendo los albums del artista');
                                    } 
                                }
                            )
                    }
                },
                error => {
                    if (error != null){
                        //this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        console.log('Error desconocido al recuperar el album');
                    }     
                }
            )
        })
    }

    // onDeleteConfirm(id){
    //      this._albumService.deleteAlbum(this.token, id)
    //     .subscribe(
    //         response => {
    //             if (!response.album){
    //                 console.log('Error desconocido borrando el album')
    //             } else {
    //                 this.getArtist();
    //             }
    //         },
    //         error => {
    //             if (error != null){
    //                 //this.alertMessage = JSON.parse(error._body).message;
    //                 console.log(error)
    //             } else {
    //                 console.log('Error desconocido al crear el artista');
    //             }     
    //         }
    //     )
    // }

    // public confirmDelete;
    // onDeleteAlbum(id){
    //     this.confirmDelete = id;
    // }

    // onDeleteCancel(){
    //     this.confirmDelete = null;
    // }

}