import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideAppInitializer,
	inject,
	effect,
	Injector,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { ClerkService } from "./service/clerk.service";
import { ConvexService } from "./service/convex.service";
import { api } from "../../convex/_generated/api";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideAppInitializer(async () => {
			const clerk = inject(ClerkService);
			const convex = inject(ConvexService);
			// Capture the injector *before* the await — the async boundary below
			// drops the injection context, so effect() needs it passed explicitly.
			const injector = inject(Injector);

			// Order matters: Convex's auth callback reads clerk.session.
			await clerk.load();
			convex.setupAuth();

			// On every transition to signed-in, upsert the Convex profile row.
			effect(
				() => {
					if (clerk.user()) {
						void convex.mutation(api.users.store, {});
					}
				},
				{ injector },
			);
		}),
	],
};
