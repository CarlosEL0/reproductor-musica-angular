import { Injectable } from '@angular/core';
// 1. Importamos la "plantilla" de canción que creamos
import { Song } from '../song.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  // 2. Este es el reproductor de audio real de HTML5
  private audio = new Audio();

  // 3. ¡TU LISTA DE CANCIONES!
  // Aquí es donde añades tus canciones locales.
  // Asegúrate que las rutas 'url' y 'albumArt' sean correctas.
  private songs: Song[] = [
    {
      id: 1,
      title: 'Título de tu Canción 1',
      artist: 'Nombre del Artista 1',
      url: 'assets/audio/cancion1.mp3', // <-- La ruta a tu MP3
      albumArt: 'assets/images/cover1.jpg' // <-- La ruta a tu imagen
    },
  ];

  // 4. Variables para saber qué está pasando
  public currentSong: Song | null = null;
  public isPlaying: boolean = false;

  constructor() { }

  // 5. Función para cargar una canción (pero no reproducirla)
  loadSong(song: Song) {
    this.currentSong = song;
    this.audio.src = this.currentSong.url;
    this.audio.load();
  }

  // 6. Función para reproducir
  play() {
    this.audio.play();
    this.isPlaying = true;
  }

  // 7. Función para pausar
  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  // 8. Función para obtener la lista de canciones
  getSongs(): Song[] {
    return this.songs;
  }
}