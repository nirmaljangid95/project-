import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, User, Video } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getChannel(username: string) {
    return this.http.get<ApiResponse<User>>(`${this.api}/c/${username}`);
  }

  getWatchHistory() {
    return this.http.get<ApiResponse<Video[]>>(`${this.api}/watch-history`);
  }

  updateAccount(payload: { fullName: string; email: string }) {
    return this.http.patch<ApiResponse<User>>(`${this.api}/update-account-details`, payload);
  }

  updateAvatar(file: File) {
    const fd = new FormData();
    fd.append('avatarLocalPath', file);
    return this.http.patch<ApiResponse<User>>(`${this.api}/update-user-avatar`, fd);
  }

  updateCover(file: File) {
    const fd = new FormData();
    fd.append('imageLocalPath', file);
    return this.http.patch<ApiResponse<User>>(`${this.api}/update-user-cover-image`, fd);
  }
}
