import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music';
import { Song } from '../../song.model';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './queue.html',
  styleUrl: './queue.css'
})
export class QueueComponent implements OnInit{
  public songs: Song[] = [];

  // Inyecta el servicio (hazlo público para usarlo en el HTML)
  constructor(public musicService: MusicService) { }

  ngOnInit(): void {
    // Obtenemos la lista de canciones del servicio
    this.songs = this.musicService.getSongs();
  }

  // Función para reproducir una canción desde la lista
  playSong(song: Song): void {
    this.musicService.loadSong(song);
    this.musicService.play();
  }
}
