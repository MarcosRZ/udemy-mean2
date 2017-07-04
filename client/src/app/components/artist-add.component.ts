import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist'
@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{

    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo = 'Añadir Artista';
        this.artist = new Artist('','','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
    }

    onSubmit(){
        console.log(this.artist)
        console.log(this.token)
        this._artistService.addArtist(this.token, this.artist)
            .subscribe(
                response => {

                    if (!response.artist){
                        this.alertMessage = 'Error al añadir artista';
                    } else {
                        this.alertMessage = 'Artista creado satisfactoriamente';
                        this.artist = response.artist;
                        this._router.navigate(['/editar-artista', response.artist._id]);
                    }
                },
                error => {
                    if (error != null){
                        this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        this.alertMessage = 'Error desconocido al crear el artista';
                    }
                }
            )
    }

}