import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, Tweet } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class TweetService {
  private readonly api = `${environment.apiUrl}/tweet`;

  constructor(private http: HttpClient) {}

  createTweet(content: string) {
    return this.http.post<ApiResponse<Tweet>>(this.api, { content });
  }

  getUserTweets(userId: string) {
    return this.http.get<ApiResponse<Tweet[]>>(`${this.api}/user/${userId}`);
  }

  updateTweet(tweetId: string, content: string) {
    return this.http.patch<ApiResponse<Tweet>>(`${this.api}/${tweetId}`, { content });
  }

  deleteTweet(tweetId: string) {
    return this.http.delete<ApiResponse>(`${this.api}/${tweetId}`);
  }
}
