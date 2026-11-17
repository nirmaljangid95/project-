import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, Video } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class LikeService {
  private readonly api = `${environment.apiUrl}/likes`;

  constructor(private http: HttpClient) {}

  toggleVideoLike(videoId: string) {
    return this.http.post<ApiResponse<{ isLiked: boolean }>>(`${this.api}/toggle/v/${videoId}`, {});
  }

  toggleCommentLike(commentId: string) {
    return this.http.post<ApiResponse<{ isLiked: boolean }>>(`${this.api}/toggle/c/${commentId}`, {});
  }

  toggleTweetLike(tweetId: string) {
    return this.http.post<ApiResponse<{ isLiked: boolean }>>(`${this.api}/toggle/t/${tweetId}`, {});
  }

  getLikedVideos() {
    return this.http.get<ApiResponse<Video[]>>(`${this.api}/videos`);
  }
}
