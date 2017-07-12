import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL }   from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'player',
    template: `
    <div class="album-image">
        <span *ngIf="song.album">
            <img id="player-image-album" src="{{url + '/get-image-album/' + song.album.image}}" />
        </span>
        <span *ngIf="!song.album">
            <img id="player-image-album" src="assets/images/corchea.jpg" />
        </span>
    </div>
    <div class="audio-file" *ngIf="song">
        <p>Reproduciendo</p>
        <span id="play-song-title">{{song.name}}</span> - <span id="play-song-artist"><span *ngIf="song.album.artist">{{song.album.artist.name}}</span></span>

        <audio controls id="player">
            <source id="mp3-source" src="{{url + '/get-song-file/' + song.file}}" type="audio/mpeg" />
            Este navegador no es compatible
        </audio>
    </div>
    `
})

export class PlayerComponent implements OnInit{

    public url: string;
    public song: Song;

    constructor(){
        this.song = new Song(1,'','','','');
        this.url = GLOBAL.url

    }

    ngOnInit(){
        var song = JSON.parse(localStorage.getItem('playing'))

        if (song){
            this.song = song;
        }
    }

}