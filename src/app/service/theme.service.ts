import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly current = signal<Theme>(this.read());

  readonly theme = this.current.asReadonly();
  readonly isDark = computed(() => this.current() === 'dark');

  toggle(): void {
    this.set(this.current() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.current.set(theme);
    this.document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      this.document.defaultView?.localStorage.setItem('theme', theme);
    } catch {
      // storage unavailable (private mode, SSR) — in-memory state still applies
    }
  }

  private read(): Theme {
    // Source of truth is the class set by the no-flash script in index.html.
    return this.document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
}
