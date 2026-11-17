import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../models/api.model';

interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/users`;
  private readonly tokenKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';
  private readonly userKey = 'currentUser';

  readonly currentUser = signal<User | null>(this.readUser());
  readonly isLoggedIn = computed(() => !!this.currentUser() && !!this.getAccessToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  register(formData: FormData) {
    return this.http.post<ApiResponse<User>>(`${this.api}/register`, formData).pipe(
      tap((res) => {
        if (res.success) {
        }
      })
    );
  }

  login(payload: { email?: string; username?: string; password: string }) {
    return this.http
      .post<ApiResponse<LoginData>>(`${this.api}/login`, payload, { withCredentials: true })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.persistSession(res.data.user, res.data.accessToken, res.data.refreshToken);
          }
        })
      );
  }

  logout() {
    return this.http.post<ApiResponse>(`${this.api}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  refreshToken() {
    return this.http
      .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
        `${this.api}/refresh-token`,
        { refreshToken: this.getRefreshToken() },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            localStorage.setItem(this.tokenKey, res.data.accessToken);
            if (res.data.refreshToken) {
              localStorage.setItem(this.refreshKey, res.data.refreshToken);
            }
          }
        })
      );
  }

  fetchCurrentUser() {
    return this.http.get<ApiResponse<User>>(`${this.api}/get-user`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
          localStorage.setItem(this.userKey, JSON.stringify(res.data));
        }
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  persistSession(user: User, accessToken: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshKey, refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
