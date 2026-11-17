import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/feed/feed.component').then((m) => m.FeedComponent),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./pages/explore/explore.component').then((m) => m.ExploreComponent),
      },
      {
        path: 'upload',
        loadComponent: () =>
          import('./pages/upload/upload.component').then((m) => m.UploadComponent),
      },
      {
        path: 'tweets',
        loadComponent: () =>
          import('./pages/tweets/tweets.component').then((m) => m.TweetsComponent),
      },
      {
        path: 'video/:id',
        loadComponent: () =>
          import('./pages/video-detail/video-detail.component').then((m) => m.VideoDetailComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'profile/:username',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
