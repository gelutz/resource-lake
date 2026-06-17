import {
	Injectable,
	signal,
	inject,
	DestroyRef,
	type Signal,
} from "@angular/core";
import { ConvexClient } from "convex/browser";
import type {
	FunctionReference,
	FunctionArgs,
	FunctionReturnType,
} from "convex/server";
import { environment } from "../../environments/environment";
import { ClerkService } from "./clerk.service";

/**
 * Wraps Convex's framework-agnostic ConvexClient for Angular.
 * - Holds the single websocket connection to your Convex cloud deployment.
 * - Wires Clerk auth so authenticated queries/mutations see ctx.auth.
 * - Exposes reactive queries as Angular signals.
 */
@Injectable({ providedIn: "root" })
export class ConvexService {
	private client = new ConvexClient(environment.convexUrl);
	private clerk = inject(ClerkService);

	/** Connect Clerk auth to Convex. Call after ClerkService.load(). */
	setupAuth(): void {
		this.client.setAuth(({ forceRefreshToken }) =>
			this.clerk.getConvexToken(forceRefreshToken),
		);
	}

	/**
	 * Subscribe to a Convex query and expose its result as a signal.
	 * Auto-unsubscribes when the calling component is destroyed.
	 */
	query<Query extends FunctionReference<"query">>(
		fn: Query,
		args: FunctionArgs<Query>,
	): Signal<FunctionReturnType<Query> | undefined> {
		const result = signal<FunctionReturnType<Query> | undefined>(undefined);
		const unsubscribe = this.client.onUpdate(fn, args, (value) =>
			result.set(value),
		);
		inject(DestroyRef).onDestroy(unsubscribe);
		return result;
	}

	/** Run a Convex mutation. */
	mutation<Mutation extends FunctionReference<"mutation">>(
		fn: Mutation,
		args: FunctionArgs<Mutation>,
	): Promise<FunctionReturnType<Mutation>> {
		return this.client.mutation(fn, args);
	}
}
