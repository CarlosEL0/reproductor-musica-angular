import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  // Inyectamos el servicio de Spotify
  constructor(private spotifyService: SpotifyService) { }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('Buscando:', input.value); // <-- Agrega este log para depurar
    this.spotifyService.searchSpotify(input.value);
  }
}
