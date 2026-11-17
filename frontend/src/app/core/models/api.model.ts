export interface ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  _id: string;
  username: string;
  email?: string;
  fullName: string;
  avatar: string | { url: string };
  coverImage?: string | { url: string };
  watchHistory?: string[];
  createdAt?: string;
  updatedAt?: string;
  subscribersCount?: number;
  channelsSubscribedToCount?: number;
  channelSubscribedToCount?: number;
  isSubscribed?: boolean;
}

export interface Video {
  _id: string;
  videoFile: string | { url: string; public_id?: string };
  thumbnail: string | { url: string; public_id?: string };
  title: string;
  description: string;
  duration?: number;
  views: number;
  isPublished?: boolean;
  owner: User | string;
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface Comment {
  _id: string;
  content: string;
  video?: string;
  owner: User;
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export function mediaUrl(value: string | { url: string } | undefined | null): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || '';
}

export function avatarUrl(user?: User | null): string {
  return mediaUrl(user?.avatar) || 'assets/default-avatar.svg';
}
