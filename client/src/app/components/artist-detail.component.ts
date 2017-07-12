import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist'
import { Album } from '../models/album'

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{

    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ){
        this.artist = new Artist('','','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
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

                        this._albumService.getAlbums(this.token, response.artist._id)
                            .subscribe(
                                response => {
                                    this.albums = response.albums
                                    console.log(this.albums);
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
                        console.log('Error desconocido al crear el artista');
                    }     
                }
            )
        })
    }

    onDeleteConfirm(id){
         this._albumService.deleteAlbum(this.token, id)
        .subscribe(
            response => {
                if (!response.album){
                    console.log('Error desconocido borrando el album')
                } else {
                    this.getArtist();
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
    }

    public confirmDelete;
    onDeleteAlbum(id){
        this.confirmDelete = id;
    }

    onDeleteCancel(){
        this.confirmDelete = null;
    }

}