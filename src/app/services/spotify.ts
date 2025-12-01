import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private spotifyToken: string | null = null;
  private searchResults = new BehaviorSubject<any[]>([]);
  public searchResults$ = this.searchResults.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Obtiene un token de acceso de Spotify usando nuestras llaves.
   */
  private async getSpotifyToken(): Promise<void> {
    const clientId = environment.spotifyClientId;
    const clientSecret = environment.spotifyClientSecret;
    const authHeader = 'Basic ' + btoa(clientId + ':' + clientSecret);
    const body = new HttpParams().set('grant_type', 'client_credentials');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader
    });

    try {
      // ESTA ES LA URL CORRECTA PARA EL TOKEN
      const response: any = await firstValueFrom(
        this.http.post('https://accounts.spotify.com/api/token', body.toString(), { headers })
      );
      
      this.spotifyToken = response.access_token;
      console.log('¡Token de Spotify obtenido con éxito!');

    } catch (error) {
      console.error('Error al obtener el token de Spotify', error);
      // Limpiamos el token si falla para que lo intente de nuevo
      this.spotifyToken = null;
    }
  }

  /**
   * Helper para asegurarse de que tenemos un token.
   */
  private async ensureToken(): Promise<void> {
    if (!this.spotifyToken) {
      await this.getSpotifyToken();
    }
  }

  /**
   * Busca pistas en Spotify usando el token.
   */
  public async searchSpotify(term: string): Promise<void> {
    if (!term) {
      this.searchResults.next([]);
      return;
    }

    await this.ensureToken();

    if (!this.spotifyToken) {
      console.error("No hay token de Spotify, no se puede buscar.");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.spotifyToken}`
    });

    const params = new HttpParams()
      .set('q', term)
      .set('type', 'track')
      .set('limit', '20');

    try {
      // ESTA ES LA URL CORRECTA PARA LA BÚSQUEDA
 const response: any = await firstValueFrom(
        this.http.get('https://api.spotify.com/v1/search', { headers, params })
      );

      // --- AÑADE ESTOS LOGS ---
      console.log('Respuesta de Spotify:', response); // ¿Qué llegó?
      console.log('Canciones encontradas:', response.tracks.items); // ¿Hay canciones?
      
      this.searchResults.next(response.tracks.items);

    } catch (error) {
      console.error('Error al buscar en Spotify', error);
    }
  }
}