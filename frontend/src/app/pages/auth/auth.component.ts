import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  error = signal('');
  success = signal('');

  loginId = '';
  password = '';

  fullName = '';
  email = '';
  username = '';
  regPassword = '';
  avatarFile: File | null = null;
  coverFile: File | null = null;
  avatarPreview = '';
  coverPreview = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  toggleMode() {
    this.mode.update((m) => (m === 'login' ? 'register' : 'login'));
    this.error.set('');
    this.success.set('');
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.avatarFile = file;
    this.avatarPreview = URL.createObjectURL(file);
  }

  onCoverChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.coverFile = file;
    this.coverPreview = URL.createObjectURL(file);
  }

  submitLogin() {
    if (!this.loginId.trim() || !this.password) {
      this.error.set('Please fill all fields');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const isEmail = this.loginId.includes('@');
    const payload = isEmail
      ? { email: this.loginId.trim(), password: this.password }
      : { username: this.loginId.trim(), password: this.password };

    this.auth.login(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/']);
        } else {
          this.error.set(res.message || 'Login failed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Invalid credentials');
      },
    });
  }

  submitRegister() {
    if (!this.fullName || !this.email || !this.username || !this.regPassword || !this.avatarFile) {
      this.error.set('All fields + avatar are required');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const fd = new FormData();
    fd.append('fullName', this.fullName.trim());
    fd.append('email', this.email.trim());
    fd.append('username', this.username.trim());
    fd.append('password', this.regPassword);
    fd.append('avatar', this.avatarFile);
    if (this.coverFile) fd.append('coverImage', this.coverFile);

    this.auth.register(fd).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set('Account created! Please log in.');
          this.mode.set('login');
          this.loginId = this.username || this.email;
          this.password = '';
        } else {
          this.error.set(res.message || 'Registration failed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Registration failed');
      },
    });
  }
}
