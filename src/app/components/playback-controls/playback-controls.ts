import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 1. AÑADE ESTO (lo necesitaremos)
// 2. IMPORTA EL SERVICIO
import { MusicService } from '../../services/music';

@Component({
  selector: 'app-playback-controls',
  standalone: true,
  imports: [CommonModule], // <-- 3. AÑADE ESTO
  templateUrl: './playback-controls.html',
  styleUrls: ['./playback-controls.css']
})
export class PlaybackControlsComponent {

  // 4. "INYECTA" EL SERVICIO
  // Lo ponemos como 'public' para poder usarlo fácil en el HTML
  constructor(public musicService: MusicService) { }

  // 5. CREA LA FUNCIÓN DE PLAY/PAUSE
  onPlayPause(): void {
    if (this.musicService.isPlaying) {
      this.musicService.pause();
    } else {
      this.musicService.play();
    }
  }
}