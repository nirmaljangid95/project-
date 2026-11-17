import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, User, Video } from '../models/api.model';

export interface ToggleSubscriptionData {
  subscribed: boolean;
  channelId: string;
  subscribersCount: number;
  myFollowingCount: number;
}

export interface SubscribersListData {
  channelId: string;
  totalSubscribers: number;
  subscribers: User[];
}

export interface SubscribedChannel extends User {
  latestVideo?: Video | null;
}

export interface SubscribedChannelsData {
  subscriberId: string;
  totalChannels: number;
  channels: SubscribedChannel[];
}

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly api = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) { }

  toggleSubscribe(channelId: string) {
    return this.http.post<ApiResponse<ToggleSubscriptionData>>(
      `${this.api}/c/${channelId}`,
      {}
    );
  }
  
  getSubscribers(channelId: string) {
    return this.http.get<ApiResponse<SubscribersListData>>(
      `${this.api}/c/${channelId}`
    );
  }
  getSubscribedChannels(subscriberId: string) {
    return this.http.get<ApiResponse<SubscribedChannelsData>>(
      `${this.api}/u/${subscriberId}`
    );
  }
}
