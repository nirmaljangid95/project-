import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TweetService } from '../../core/services/tweet.service';
import { AuthService } from '../../core/services/auth.service';
import { LikeService } from '../../core/services/like.service';
import { Tweet, User } from '../../core/models/api.model';

@Component({
  selector: 'app-tweets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tweets.component.html',
  styleUrl: './tweets.component.css',
})
export class TweetsComponent implements OnInit {
  tweets = signal<Tweet[]>([]);
  content = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private tweetService: TweetService,
    public auth: AuthService,
    private likeService: LikeService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    const user = this.auth.currentUser();
    if (!user?._id) return;
    this.loading.set(true);
    this.tweetService.getUserTweets(user._id).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.tweets.set(res.data || []);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not load tweets');
      },
    });
  }

  post() {
    if (!this.content.trim()) return;
    this.tweetService.createTweet(this.content.trim()).subscribe({
      next: (res) => {
        if (res.success) {
          this.content = '';
          this.load();
        }
      },
      error: (err) => this.error.set(err?.error?.message || 'Failed to post'),
    });
  }

  deleteTweet(id: string) {
    this.tweetService.deleteTweet(id).subscribe({
      next: () => this.tweets.update((list) => list.filter((t) => t._id !== id)),
    });
  }

  likeTweet(id: string) {
    this.likeService.toggleTweetLike(id).subscribe();
  }

  ownerOf(t: Tweet): User | null {
    return typeof t.owner === 'object' ? t.owner : this.auth.currentUser();
  }

  timeAgo(date?: string): string {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins || 1}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }
}
