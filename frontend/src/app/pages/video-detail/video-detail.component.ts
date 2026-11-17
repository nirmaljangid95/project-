import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VideoService } from '../../core/services/video.service';
import { CommentService } from '../../core/services/comment.service';
import { LikeService } from '../../core/services/like.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';
import { Video, Comment, User, mediaUrl, avatarUrl } from '../../core/models/api.model';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.css',
})
export class VideoDetailComponent implements OnInit {
  video = signal<Video | null>(null);
  comments = signal<Comment[]>([]);
  commentText = '';
  liked = signal(false);
  isSubscribed = signal(false);
  followLoading = signal(false);
  loading = signal(true);
  mediaUrl = mediaUrl;
  avatarUrl = avatarUrl;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private commentService: CommentService,
    private likeService: LikeService,
    private subscriptionService: SubscriptionService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.load(id);
    });
  }

  get owner(): User | null {
    const v = this.video();
    return v && typeof v.owner === 'object' ? v.owner : null;
  }

  load(id: string) {
    this.loading.set(true);
    this.videoService.getVideoById(id).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.video.set(res.data);
          this.liked.set(!!res.data.isLiked);
          const owner = typeof res.data.owner === 'object' ? res.data.owner : null;
          this.isSubscribed.set(!!owner?.isSubscribed);
          this.loadComments(id);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  loadComments(videoId: string) {
    this.commentService.getComments(videoId).subscribe({
      next: (res) => {
        const data = res.data as { docs?: Comment[] } | Comment[];
        if (Array.isArray(data)) {
          this.comments.set(data);
        } else {
          this.comments.set(data?.docs || []);
        }
      },
    });
  }

  commentAvatar(c: Comment): string {
    return avatarUrl(c.owner);
  }

  toggleLike() {
    const v = this.video();
    if (!v) return;
    this.likeService.toggleVideoLike(v._id).subscribe({
      next: (res) => {
        if (res.success) this.liked.set(res.data.isLiked);
      },
    });
  }

  toggleFollow() {
    const o = this.owner;
    if (!o?._id || this.followLoading()) return;

    this.followLoading.set(true);
    const wasSubscribed = this.isSubscribed();
    this.isSubscribed.set(!wasSubscribed);

    this.subscriptionService.toggleSubscribe(o._id).subscribe({
      next: (res) => {
        this.followLoading.set(false);
        const data = res?.data;
        if (!data) return;

        this.isSubscribed.set(data.subscribed);
        this.video.update((prev) => {
          if (!prev || typeof prev.owner !== 'object') return prev;
          return {
            ...prev,
            owner: {
              ...prev.owner,
              isSubscribed: data.subscribed,
              subscribersCount: data.subscribersCount ?? prev.owner.subscribersCount ?? 0,
            },
          };
        });
      },
      error: () => {
        this.followLoading.set(false);
        this.isSubscribed.set(wasSubscribed);
      },
    });
  }

  postComment() {
    const v = this.video();
    if (!v || !this.commentText.trim()) return;
    this.commentService.addComment(v._id, this.commentText.trim()).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentText = '';
          this.loadComments(v._id);
        }
      },
    });
  }
}
