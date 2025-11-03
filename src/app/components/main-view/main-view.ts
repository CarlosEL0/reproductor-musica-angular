import { Component, OnInit } from '@angular/core';
// 1. Importa el servicio y el modelo de canción
import { MusicService } from '../../services/music';
import { Song } from '../../song.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule], // Lo arreglaremos si es necesario, puede que necesites CommonModule
  templateUrl: './main-view.html',
  styleUrls: ['./main-view.css']
})
export class MainViewComponent implements OnInit {

  // 2. Esta variable guardará tu lista de canciones
  public songs: Song[] = [];

  // 3. "Inyecta" el servicio en el constructor
  constructor(private musicService: MusicService) { }

  // 4. Cuando el componente se inicia, pide las canciones
  ngOnInit(): void {
    this.songs = this.musicService.getSongs();
  }

  // 5. Esta función se llamará cuando hagamos clic en una tarjeta
  playSong(song: Song): void {
    this.musicService.loadSong(song);
    this.musicService.play();
  }

}