import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 1. AÑADE ESTO (lo necesitaremos)
import { MusicService } from '../../services/music';
import { FormatTimePipe } from '../../pipes/format-time-pipe';

@Component({
  selector: 'app-playback-controls',
  standalone: true,
  imports: [CommonModule, FormatTimePipe],
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

  // Se llama cuando el usuario MUEVE el slider de progreso
  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.musicService.seek(Number(input.value));
  }

  // Se llama cuando el usuario MUEVE el slider de volumen
  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.musicService.changeVolume(Number(input.value));
  }
}