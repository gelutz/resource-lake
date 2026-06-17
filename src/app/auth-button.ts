import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ClerkService } from "./service/clerk.service";

@Component({
	selector: "app-auth-button",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    @if (clerk.user(); as user) {
      <div class="flex items-center gap-3">
        <span class="text-sm text-muted-foreground">
          {{ user.firstName ?? user.primaryEmailAddress?.emailAddress }}
        </span>
        <button
          type="button"
          class="panel card-hover h-9 px-4 text-sm text-muted-foreground hover:text-foreground"
          (click)="clerk.signOut()"
        >
          Sign out
        </button>
      </div>
    } @else {
      <button
        type="button"
        class="panel card-hover h-9 px-4 text-sm text-foreground"
        (click)="clerk.openSignIn()"
      >
        Sign in
      </button>
    }
  `,
})
export class AuthButton {
	protected readonly clerk = inject(ClerkService);
}
