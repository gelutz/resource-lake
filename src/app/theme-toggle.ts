import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ThemeService } from "./service/theme.service";

@Component({
	selector: "app-theme-toggle",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    <button
      type="button"
      class="panel card-hover grid size-9 place-items-center text-muted-foreground hover:text-foreground"
      [attr.aria-pressed]="theme.isDark()"
      [attr.aria-label]="theme.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
      (click)="theme.toggle()"
    >
      @if (theme.isDark()) {
        <!-- moon -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="size-4">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke-linejoin="round" />
        </svg>
      } @else {
        <!-- sun -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="size-4">
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
            stroke-linecap="round"
          />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggle {
	protected readonly theme = inject(ThemeService);
}
