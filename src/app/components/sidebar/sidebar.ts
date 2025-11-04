import { Component } from '@angular/core';
import { MusicService } from '../../services/music';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
// 2. INYÉCTALO EN EL CONSTRUCTOR
  constructor(private musicService: MusicService) { }

  // 3. AÑADE LA FUNCIÓN DE BÚSQUEDA
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Llama al servicio cada vez que el usuario teclea
    this.musicService.searchSpotify(input.value);
  }
}
