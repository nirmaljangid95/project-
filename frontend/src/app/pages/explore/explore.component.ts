import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VideoService } from '../../core/services/video.service';
import { Video, mediaUrl } from '../../core/models/api.model';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  videos = signal<Video[]>([]);
  query = '';
  loading = signal(false);
  mediaUrl = mediaUrl;

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.search();
  }

  search() {
    this.loading.set(true);
    this.videoService
      .getVideos({ page: 1, limit: 30, query: this.query.trim() || undefined, sortBy: 'views', sortType: 'desc' })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.videos.set(res.data?.docs || []);
        },
        error: () => this.loading.set(false),
      });
  }
}
