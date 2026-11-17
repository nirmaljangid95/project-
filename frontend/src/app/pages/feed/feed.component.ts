import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../core/services/video.service';
import { Video } from '../../core/models/api.model';
import { VideoCardComponent } from '../../shared/video-card/video-card.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  videos = signal<Video[]>([]);
  loading = signal(true);
  error = signal('');
  page = 1;
  hasMore = signal(false);

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.load();
  }

  load(append = false) {
    this.loading.set(true);
    this.videoService.getVideos({ page: this.page, limit: 10, sortBy: 'createdAt', sortType: 'desc' }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          const docs = res.data.docs || [];
          this.videos.set(append ? [...this.videos(), ...docs] : docs);
          this.hasMore.set(!!res.data.hasNextPage);
        } else {
          this.error.set(res.message || 'Could not load feed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not load feed');
      },
    });
  }

  loadMore() {
    this.page += 1;
    this.load(true);
  }
}
