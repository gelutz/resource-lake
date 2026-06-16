import { Injectable, signal } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import type { UserResource } from '@clerk/types';
import { environment } from '../environments/environment';

/**
 * Thin Angular wrapper around Clerk's framework-agnostic JS SDK.
 * Loads Clerk once, exposes the current user as a signal, and hands out
 * Convex-templated JWTs for ConvexService to attach to requests.
 */
@Injectable({ providedIn: 'root' })
export class ClerkService {
  private clerk = new Clerk(environment.clerkPublishableKey);
  private loaded = false;

  /** Current signed-in user, or null. Reactive. */
  readonly user = signal<UserResource | null>(null);

  /** Call once at startup (see app.config.ts). */
  async load(): Promise<void> {
    if (this.loaded) return;
    await this.clerk.load();
    this.loaded = true;
    this.user.set(this.clerk.user ?? null);
    // Keep the signal in sync with sign-in / sign-out.
    this.clerk.addListener(({ user }) => this.user.set(user ?? null));
  }

  /** Opens Clerk's prebuilt sign-in modal. */
  openSignIn(): void {
    this.clerk.openSignIn();
  }

  signOut(): Promise<void> {
    return this.clerk.signOut();
  }

  /**
   * Returns a fresh JWT minted from the Clerk "convex" template, or null when
   * signed out. ConvexClient calls this to authenticate each session.
   */
  async getConvexToken(forceRefresh = false): Promise<string | null> {
    const session = this.clerk.session;
    if (!session) return null;
    return session.getToken({ template: 'convex', skipCache: forceRefresh });
  }
}
