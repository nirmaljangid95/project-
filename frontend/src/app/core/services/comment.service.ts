import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, Comment, Paginated } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly api = `${environment.apiUrl}/comment`;

  constructor(private http: HttpClient) {}

  getComments(videoId: string, page = 1, limit = 20) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<Paginated<Comment>>>(`${this.api}/${videoId}`, { params });
  }

  addComment(videoId: string, content: string) {
    return this.http.post<ApiResponse<Comment>>(`${this.api}/${videoId}`, { content });
  }

  updateComment(commentId: string, content: string) {
    return this.http.patch<ApiResponse<Comment>>(`${this.api}/c/${commentId}`, { content });
  }

  deleteComment(commentId: string) {
    return this.http.delete<ApiResponse>(`${this.api}/c/${commentId}`);
  }
}
