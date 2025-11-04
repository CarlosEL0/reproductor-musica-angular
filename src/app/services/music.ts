import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments'; // <-- Importa tus llaves
import { firstValueFrom } from 'rxjs'; // Lo usaremos para facilitar las peticiones

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
  private currentSongIndex: number = -1; // Guardará la posición de la canción actual
  private spotifyToken: string | null = null;

  // Emitirán el estado actual a quien esté escuchando
  private currentTime = new BehaviorSubject<number>(0);
  private duration = new BehaviorSubject<number>(0);

  // Hacemos públicos los observables
  public currentTime$ = this.currentTime.asObservable();
  public duration$ = this.duration.asObservable();

  // --- 3. INYECTA PLATFORM_ID en el constructor ---
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
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
      this.audio.addEventListener('ended', () => this.playNext());
    }
  }



  // --- 4. AÑADE COMPROBACIONES en las funciones ---
  // Tenemos que asegurarnos de que 'this.audio' exista antes de usarlo

  loadSong(song: Song) {
    this.currentSong = song;
    // Si this.audio existe...
    this.currentSongIndex = this.songs.findIndex(s => s.id === song.id);
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

  public playNext(): void {
  // Si no hay índice, no hagas nada
  if (this.currentSongIndex === -1) {
    return;
  }

  // 1. Avanza al siguiente índice
  this.currentSongIndex++;

  // 2. Si nos pasamos del final, vuelve al inicio (loop)
  if (this.currentSongIndex >= this.songs.length) {
    this.currentSongIndex = 0;
  }

  // 3. Carga y reproduce la nueva canción
  const nextSong = this.songs[this.currentSongIndex];
  this.loadSong(nextSong);
  this.play();
}

public playPrevious(): void {
  // Si no hay índice, no hagas nada
  if (this.currentSongIndex === -1) {
    return;
  }

  // 1. Retrocede al índice anterior
  this.currentSongIndex--;

  // 2. Si nos pasamos del inicio, ve al final (loop)
  if (this.currentSongIndex < 0) {
    this.currentSongIndex = this.songs.length - 1;
  }

  // 3. Carga y reproduce la nueva canción
  const prevSong = this.songs[this.currentSongIndex];
  this.loadSong(prevSong);
  this.play();
}

/**
 * Obtiene un token de acceso de Spotify usando nuestras llaves.
 */
private async getSpotifyToken(): Promise<void> {
  // 1. Obtenemos las credenciales del environment
  const clientId = environment.spotifyClientId;
  const clientSecret = environment.spotifyClientSecret;

  // 2. Spotify pide las credenciales en formato Base64
  const authHeader = 'Basic ' + btoa(clientId + ':' + clientSecret);

  // 3. Preparamos el 'body' de la petición
  const body = new HttpParams().set('grant_type', 'client_credentials');

  // 4. Preparamos las 'headers' de la petición
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': authHeader
  });

  try {
    // 5. Hacemos la petición POST a la API de Spotify
    const response: any = await firstValueFrom(
      this.http.post('https://accounts.spotify.com/api/token', body.toString(), { headers })
    );

    // 6. Guardamos el token que nos devolvió
    this.spotifyToken = response.access_token;
    console.log('¡Token de Spotify obtenido con éxito!');

  } catch (error) {
    console.error('Error al obtener el token de Spotify', error);
  }
}

/**
 * Un 'helper' para asegurarnos de que tenemos un token antes de hacer cualquier búsqueda.
 * Si no lo tenemos, lo pide.
 */
private async ensureToken(): Promise<void> {
  if (!this.spotifyToken) {
    // Solo pedirá el token la primera vez
    await this.getSpotifyToken();
  }
}

}