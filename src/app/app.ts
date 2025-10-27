import { Component } from '@angular/core';
// Borra 'RouterOutlet' si no lo tienes.
import { RouterOutlet } from '@angular/router'; 

// --- 1. IMPORTA TUS 3 COMPONENTES ---
import { SidebarComponent } from './components/sidebar/sidebar';
import { MainViewComponent } from './components/main-view/main-view';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls';

@Component({
  selector: 'app-root',
  standalone: true,
  
  // --- 2. AÑÁDELOS AL ARRAY 'imports' ---
  imports: [
    RouterOutlet, // (Déjalo si ya estaba)
    SidebarComponent,
    MainViewComponent,
    PlaybackControlsComponent
  ],

  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'mi-reproductor'; // O lo que tengas
}