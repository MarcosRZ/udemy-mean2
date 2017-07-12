import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist'
import { Album } from '../models/album'
import { Song } from '../models/song'

@Component({
    selector: 'song-detail',
    templateUrl: '../views/song-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class SongDetailComponent implements OnInit{

    public song: Song;
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
        this.song = new Song(1, '','', null, '')
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._songService.getSong(this.token, id)
            .subscribe(
                response => {
                    if (!response.album){
                        this._router.navigate(['/'])
                    } else {
                        console.log(response.song)
                        this.song = response.song;
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


}