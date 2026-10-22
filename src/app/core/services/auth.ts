import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  Profile,
  TokenResponse
} from '../interface/auth';

const STORAGE_KEY = 'auth-store';

@Service()
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  userSession = signal<LoginResponse | null>(null);

  getToken = computed<string | null>(() => this.userSession()?.token.accessToken || null);
  getUserProfile = computed<Profile | null>(() => this.userSession()?.profile || null);
  getRefreshToken = computed<string | null>(() => this.userSession()?.token.refreshToken || null);
  getRoles = computed<string[]>(() => this.userSession()?.profile.roles || []);
  isAuthenticated = computed<boolean>(() => !!this.userSession());

  constructor() {
    const authStore = localStorage.getItem(STORAGE_KEY);
    if (authStore) {
      this.userSession.set(JSON.parse(authStore));
    }
  }

  login(request: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout() {
    const currentRefreshToken = this.getRefreshToken();
    if (!currentRefreshToken) {
      return throwError(() => new Error('No se encontró un refresh token para cerrar sesión.'));
    }
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/logout`, { refreshToken: currentRefreshToken })
      .pipe(tap(() => this.removeSession()));
  }

  refreshToken(): Observable<TokenResponse> {
    const currentRefreshToken = this.getRefreshToken();
    if (!currentRefreshToken) {
      return throwError(() => new Error('No se encontró un refresh token para refrescar el token de acceso.'));
    }
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/refresh-token`, { refreshToken: currentRefreshToken })
      .pipe(
        tap((response) => this.setSession({ token: response, profile: this.getUserProfile()! })),
      );
  }

  setSession({ token, profile }: LoginResponse): void {
    this.userSession.set({ token, profile });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, profile }));
  }

  removeSession(): void {
    this.userSession.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }
}
