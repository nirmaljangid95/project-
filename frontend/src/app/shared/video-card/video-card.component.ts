import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Video, mediaUrl, avatarUrl, User } from '../../core/models/api.model';
import { LikeService } from '../../core/services/like.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css',
})
export class VideoCardComponent {
  @Input({ required: true }) video!: Video;
  @Output() liked = new EventEmitter<{ id: string; isLiked: boolean }>();

  likedLocal = signal(false);
  heartAnim = signal(false);

  constructor(private likeService: LikeService) {}

  get thumb(): string {
    return mediaUrl(this.video.thumbnail);
  }

  get owner(): User | null {
    return typeof this.video.owner === 'object' ? this.video.owner : null;
  }

  get ownerName(): string {
    return this.owner?.username || '';
  }

  get ownerAvatar(): string {
    return avatarUrl(this.owner);
  }

  get canOpenProfile(): boolean {
    return !!this.ownerName;
  }

  toggleLike() {
    this.likeService.toggleVideoLike(this.video._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.likedLocal.set(res.data.isLiked);
          this.heartAnim.set(true);
          setTimeout(() => this.heartAnim.set(false), 400);
          this.liked.emit({ id: this.video._id, isLiked: res.data.isLiked });
        }
      },
    });
  }

  timeAgo(date?: string): string {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins || 1}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }
}
