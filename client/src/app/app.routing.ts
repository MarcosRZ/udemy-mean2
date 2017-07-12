import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import user
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { SongAddComponent } from './components/song-add.component';
import { SongDetailComponent } from './components/song-detail.component';
import { SongEditComponent } from './components/song-edit.component';
// Configuraciones de rutas
const appRoutes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: 'artista/:id', component: ArtistDetailComponent},
    {path: 'editar-artista/:id', component: ArtistEditComponent},
    {path: 'artistas/:page', component: ArtistListComponent},
    {path: 'crear-artista', component: ArtistAddComponent},
    {path: 'album/:id', component: AlbumDetailComponent},
    {path: 'crear-album/:artist', component: AlbumAddComponent},
    {path: 'editar-album/:album', component: AlbumEditComponent},
    {path: 'crear-tema/:album', component: SongAddComponent},
    {path: 'cancion/:id', component: SongDetailComponent},
    {path: 'editar-cancion/:id', component: SongEditComponent},
    {path: '**', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

