import { Injectable, signal } from "@angular/core";
import { Clerk } from "@clerk/clerk-js";
import { environment } from "../../environments/environment";

// Derive the user type straight from the Clerk instance so it always matches
// `clerk.user` exactly (avoids @clerk/types vs clerk-js version skew).
type ClerkUser = NonNullable<Clerk["user"]>;

/**
 * Thin Angular wrapper around Clerk's framework-agnostic JS SDK.
 * Loads Clerk once, exposes the current user as a signal, and hands out
 * Convex-templated JWTs for ConvexService to attach to requests.
 */
@Injectable({ providedIn: "root" })
export class ClerkService {
	private clerk = new Clerk(environment.clerkPublishableKey);
	private loaded = false;

	/** Current signed-in user, or null. Reactive. */
	readonly user = signal<ClerkUser | null>(null);

	/** Call once at startup (see app.config.ts). */
	async load(): Promise<void> {
		if (this.loaded) return;
		// clerk-js v6 no longer bundles the prebuilt UI; we must load the UI
		// bundle ourselves and hand its constructor to load(), otherwise
		// openSignIn() throws "Clerk was not loaded with Ui components".
		const ClerkUI = await this.loadUiBundle();
		await this.clerk.load({ ui: { ClerkUI } } as Parameters<Clerk["load"]>[0]);
		this.loaded = true;
		this.user.set(this.clerk.user ?? null);
		// Keep the signal in sync with sign-in / sign-out.
		this.clerk.addListener(({ user }) => this.user.set(user ?? null));
	}

	/**
	 * Injects Clerk's hosted UI bundle (`@clerk/ui`) once and resolves with the
	 * ClerkUI constructor it exposes on `window.__internal_ClerkUICtor`. The
	 * host domain is derived from the publishable key.
	 */
	private loadUiBundle(): Promise<unknown> {
		const w = window as unknown as { __internal_ClerkUICtor?: unknown };
		if (w.__internal_ClerkUICtor) return Promise.resolve(w.__internal_ClerkUICtor);

		// pk_<env>_<base64("<frontend-api>$")> -> decode + drop trailing "$".
		const encoded = environment.clerkPublishableKey.split("_").slice(2).join("_");
		const domain = atob(encoded).replace(/\$+$/, "");

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = `https://${domain}/npm/@clerk/ui@1/dist/ui.browser.js`;
			script.async = true;
			script.crossOrigin = "anonymous";
			script.onload = () => resolve(w.__internal_ClerkUICtor);
			script.onerror = () =>
				reject(new Error("Failed to load Clerk UI bundle"));
			document.head.appendChild(script);
		});
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
		return session.getToken({ template: "convex", skipCache: forceRefresh });
	}
}
