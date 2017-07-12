import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL }   from '../services/global';
import { Song } from '../models/song';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{

    public song: Song;
    public titulo: string;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ){
        this.titulo = 'Crear nueva canción';
        this.song = new Song(1,'','','','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        // Llamar al metodo del API para sacar artista por id
        console.log("SongAddComponent cargado.")

        this._route.params.subscribe(params => {
            this.song.album = params['album'];
        })
    }

    onSubmit(){

        console.log(this.song)

        this._songService.addSong(this.token,this.song)
        .subscribe(
            response => {
                if (!response.song){
                    this.alertMessage = "Error al añadir canción";
                } else {
                    this.alertMessage = "Canción creada correctamente";
                    this.song = response.song;
                    this._router.navigate(['/editar-cancion', response.song._id])
                }
            },
            error => {
                if (error != null){
                    this.alertMessage = JSON.parse(error._body).message;
                    console.log(error)
                } else {
                    this.alertMessage = 'Error desconocido al crear la canción';
                }
            }
        )
    }

}  