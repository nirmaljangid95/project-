import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../core/services/video.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  title = '';
  description = '';
  videoFile: File | null = null;
  thumbFile: File | null = null;
  thumbPreview = '';
  loading = signal(false);
  error = signal('');
  success = signal('');
  uploadedId = signal<string | null>(null);

  constructor(
    private videoService: VideoService,
    private router: Router
  ) { }

  onVideo(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.videoFile = file;
  }

  onThumb(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.thumbFile = file;
    this.thumbPreview = URL.createObjectURL(file);
  }

  submit() {
    if (!this.title.trim() || !this.description.trim() || !this.videoFile || !this.thumbFile) {
      this.error.set('Title, description, video and thumbnail are required');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const fd = new FormData();
    fd.append('title', this.title.trim());
    fd.append('description', this.description.trim());
    fd.append('videoFile', this.videoFile);
    fd.append('thumbnail', this.thumbFile);

    this.videoService.publishVideo(fd).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.uploadedId.set(res.data._id);
          this.success.set('Uploaded! Publish it so it appears on the feed.');
        } else {
          this.error.set(res.message || 'Upload failed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Upload failed');
      },
    });
  }

  publishNow() {
    const id = this.uploadedId();
    if (!id) return;
    this.videoService.togglePublish(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/video', id]);
        }
      },
    });
  }
}
