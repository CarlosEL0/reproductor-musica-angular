// --- 1. IMPORTA Inject, PLATFORM_ID y isPlatformBrowser ---
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Song } from '../song.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MusicService {

  // --- 2. NO INICIALICES 'audio' AQUÍ ---
  // private audio = new Audio(); <-- Esta línea es el problema
  private audio: HTMLAudioElement | undefined; // <-- La declaramos como indefinida

  // Tu lista de canciones (esto está bien)
  private songs: Song[] = [
    {
      id: 1,
      title: 'Ambien slide',
      artist: 'Cigarettes after sex',
      url: 'assets/audio/cancion1.mp3',
      albumArt: 'assets/images/cover1.jpg'
    },
    {
      id:2,
      title: 'House of ballons',
      artist: 'The weeknd',
      url: 'assets/audio/house of ballons.mp3',
      albumArt: 'assets/images/cover2.jpeg'
    }
    // ...
  ];

  public currentSong: Song | null = null;
  public isPlaying: boolean = false;

  // Emitirán el estado actual a quien esté escuchando
  private currentTime = new BehaviorSubject<number>(0);
  private duration = new BehaviorSubject<number>(0);

  // Hacemos públicos los observables
  public currentTime$ = this.currentTime.asObservable();
  public duration$ = this.duration.asObservable();

  // --- 3. INYECTA PLATFORM_ID en el constructor ---
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Comprueba si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Si SÍ estamos en el navegador, AHORA SÍ crea el audio
      this.audio = new Audio();

      // Escucha el evento 'timeupdate' (se dispara varias veces por segundo)
      this.audio.addEventListener('timeupdate', () => {
        this.currentTime.next(this.audio!.currentTime);
      });

      // Escucha el evento 'loadedmetadata' (se dispara cuando la canción carga)
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration.next(this.audio!.duration);
      });
    }
  }



  // --- 4. AÑADE COMPROBACIONES en las funciones ---
  // Tenemos que asegurarnos de que 'this.audio' exista antes de usarlo

  loadSong(song: Song) {
    this.currentSong = song;
    // Si this.audio existe...
    if (this.audio) {
      this.audio.src = this.currentSong.url;
      this.audio.load();
    }
  }

  play() {
    // Si this.audio existe...
    if (this.audio) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  pause() {
    // Si this.audio existe...
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  getSongs(): Song[] {
    return this.songs;
  }

  // Para adelantar/atrasar la canción
  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  // Para cambiar el volumen
  changeVolume(volume: number) {
    if (this.audio) {
      // El slider da 0-100, el audio usa 0.0-1.0
      this.audio.volume = volume / 100;
    }
  }
}