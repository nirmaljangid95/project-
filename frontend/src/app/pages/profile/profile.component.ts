
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { VideoService } from '../../core/services/video.service';
import { SubscriptionService } from '../../core/services/subscription.service';

import { User, Video, mediaUrl } from '../../core/models/api.model';
import { TweetService } from '../../core/services/tweet.service';
import { LikeService } from '../../core/services/like.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profile = signal<User | null>(null);
  videos = signal<Video[]>([]);
  tweets = signal<any[]>([]);

  loading = signal(true);
  followLoading = signal(false);
  error = signal<string | null>(null);
  isOwn = signal(false);
  activeTab = signal<'videos' | 'tweets'>('videos');

  mediaUrl = mediaUrl;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private videoService: VideoService,
    private subscriptionService: SubscriptionService,
    private tweetService: TweetService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const username =
        params.get('username') ||
        this.auth.currentUser()?.username;

      if (!username) {
        this.error.set('Please log in to view your profile.');
        this.loading.set(false);
        return;
      }

      this.loadProfile(username);
    });
  }

  loadProfile(username: string): void {
    this.loading.set(true);
    this.error.set(null);

    const me = this.auth.currentUser();
    this.isOwn.set(me?.username === username);

    this.userService.getChannel(username).subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          this.profile.set(null);
          this.error.set('Profile not found.');
          this.loading.set(false);
          return;
        }

        this.profile.set(res.data);
        this.loadVideos(res.data._id);
        this.loadTweets(res.data._id);
      },

      error: () => {
        if (this.isOwn() && me) {
          this.profile.set(me);
          this.loadVideos(me._id);
          this.loadTweets(me._id);
        } else {
          this.profile.set(null);
          this.error.set('Unable to load profile.');
          this.loading.set(false);
        }
      },
    });
  }

  private loadVideos(userId: string): void {
    this.videoService.getVideos({ userId, limit: 50 }).subscribe({
      next: (res) => {
        this.videos.set(res.data?.docs || []);
        this.loading.set(false);
      },
      error: () => {
        this.videos.set([]);
        this.error.set('Unable to load videos.');
        this.loading.set(false);
      },
    });
  }

  private loadTweets(userId: string): void {
    if (!userId) {
      this.tweets.set([]);
      return;
    }

    this.tweetService.getUserTweets(userId).subscribe({
      next: (res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        this.tweets.set(list);
      },
      error: () => {
        this.tweets.set([]);
      },
    });
  }

  avatarUrl(user: User): string {
    const u = user as any;

    const avatar =
      u.avatar ||
      u.avatarUrl ||
      u.profilePicture ||
      u.profileImage;

    return this.mediaUrl(avatar) || 'assets/default-avatar.png';
  }

  followingCount(user: User): number {
    const u = user as any;

    return (
      u.followingCount ??
      u.subscriptionsCount ??
      u.channelsSubscribedToCount ??
      0
    );
  }

  setTab(tab: 'videos' | 'tweets'): void {
    this.activeTab.set(tab);

    // Refresh tweets when opening the tab
    if (tab === 'tweets') {
      const id = this.profile()?._id;
      if (id) this.loadTweets(id);
    }
  }

  toggleSubscribe(): void {
    const p = this.profile();

    if (!p?._id || this.followLoading()) {
      return;
    }

    this.followLoading.set(true);
    this.error.set(null);

    this.subscriptionService.toggleSubscribe(p._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.profile.update((prev) =>
            prev
              ? {
                  ...prev,
                  isSubscribed: res.data.subscribed,
                  subscribersCount: Math.max(
                    0,
                    (prev.subscribersCount || 0) +
                      (res.data.subscribed ? 1 : -1)
                  ),
                }
              : prev
          );
        } else {
          this.error.set('Unable to update follow status.');
        }

        this.followLoading.set(false);
      },

      error: () => {
        this.error.set('Unable to update follow status.');
        this.followLoading.set(false);
      },
    });
  }

  timeAgo(date: string | Date): string {
    if (!date) return '';

    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    );

    if (Number.isNaN(seconds)) return '';

    if (seconds < 60) return 'Just now';
    if (seconds < 3600)
      return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400)
      return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000)
      return `${Math.floor(seconds / 86400)}d ago`;

    return new Date(date).toLocaleDateString();
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
