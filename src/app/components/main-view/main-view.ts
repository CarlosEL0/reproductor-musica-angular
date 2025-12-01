import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MusicService } from '../../services/music';
import { SpotifyService } from '../../services/spotify';
import { Song } from '../../song.model';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule], // Ya no necesitamos AsyncPipe
  templateUrl: './main-view.html',
  styleUrls: ['./main-view.css']
})
export class MainViewComponent implements OnInit {

  public songs: Song[] = [];
  
  // AHORA ES UNA LISTA SIMPLE, NO UN OBSERVABLE
  public spotifyResults: any[] = [];

  constructor(
    private musicService: MusicService,
    private spotifyService: SpotifyService
  ) {
    // NOS SUSCRIBIMOS MANUALMENTE
    // Cada vez que llegue un dato, actualizamos la variable
    this.spotifyService.searchResults$.subscribe(datos => {
      console.log('Actualizando vista con:', datos.length, 'canciones');
      this.spotifyResults = datos;
    });
  }

  ngOnInit(): void {
    this.songs = this.musicService.getSongs();
  }

  playSong(song: Song): void {
    this.musicService.loadSong(song);
    this.musicService.play();
  }
}