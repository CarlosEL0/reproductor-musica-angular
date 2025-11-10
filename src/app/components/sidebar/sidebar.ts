import { Component } from '@angular/core';
// 1. IMPORTA EL NUEVO SERVICIO
import { SpotifyService } from '../../services/spotify';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  // 2. INYÉCTALO (puedes borrar el MusicService si ya no se usa aquí)
  constructor(private spotifyService: SpotifyService) { }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    // 3. LLAMA AL SERVICIO CORRECTO
    this.spotifyService.searchSpotify(input.value);
  }
}