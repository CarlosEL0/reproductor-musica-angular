import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  constructor(private spotifyService: SpotifyService) { }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    // 3. LLAMA AL SERVICIO CORRECTO
    this.spotifyService.searchSpotify(input.value);
  }
}
