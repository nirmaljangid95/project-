import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated, Video } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly api = `${environment.apiUrl}/video`;

  constructor(private http: HttpClient) {}

  getVideos(opts: {
    page?: number;
    limit?: number;
    query?: string;
    sortBy?: string;
    sortType?: string;
    userId?: string;
  } = {}) {
    let params = new HttpParams();
    Object.entries(opts).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<Paginated<Video>>>(this.api, { params });
  }

  getVideoById(videoId: string) {
    return this.http.get<ApiResponse<Video>>(`${this.api}/v/${videoId}`);
  }

  publishVideo(formData: FormData) {
    return this.http.post<ApiResponse<Video>>(this.api, formData);
  }

  updateVideo(videoId: string, formData: FormData) {
    return this.http.patch<ApiResponse<Video>>(`${this.api}/v/${videoId}`, formData);
  }

  deleteVideo(videoId: string) {
    return this.http.delete<ApiResponse>(`${this.api}/v/${videoId}`);
  }

  togglePublish(videoId: string) {
    return this.http.patch<ApiResponse<Video>>(`${this.api}/toggle/publish/${videoId}`, {});
  }
}
