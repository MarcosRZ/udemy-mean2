import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL }   from '../services/global';
import { Artist } from '../models/artist'
@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit{

    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prevPage;
    public alertMessage;

    constructor(
        
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){

        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.nextPage = 1;
        this.prevPage = 1;
    }

    ngOnInit(){
        console.log('ArtistListComponent inicializado!')

        // Obtener el listado de artistas
        this.getArtists();
    }

    getArtists(){
        this._route.params.forEach((params: Params) =>{
            let page = +params['page'];
            
            if (!page){
                page = 1;
                
            } else {
                this.nextPage = page + 1;
                this.prevPage = page - 1;

                if (this.prevPage < 1) this.prevPage = 1;
            }

            this._artistService.getArtists(this.token, page)
                .subscribe(
                    response => {
                        if (!response.artists){
                            this._router.navigate(['/'])
                        } else {
                            this.artists = response.artists;
                            console.log(this.artists)
                        }
                    },
                    error => {
                        if (error != null){
                            this.alertMessage = JSON.parse(error._body).message;
                            console.log(error)
                        } else {
                            this.alertMessage = 'Error desconocido al obtener el listado de artistas!';
                        }
                    }
                )
        });
    }

    public confirmDelete;
    onDeleteArtist(id){
        this.confirmDelete = id;
    }

    onDeleteCancel(){
        this.confirmDelete = null;
    }

    onDeleteConfirm(id){
        this._artistService.deleteArtist(this.token, id)
            .subscribe(
                response => {

                    if (!response.artist){
                        this.alertMessage = 'No se ha borrado el artista';
                    } 
                    this.getArtists();
                },
                error => {
                    if (error != null){
                        this.alertMessage = JSON.parse(error._body).message;
                        console.log(error)
                    } else {
                        this.alertMessage = 'Error desconocido al borrar el artista';
                    }
            });
    }

}