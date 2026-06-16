import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/** The "great" resource types — not loose tags, a fixed vocabulary. */
type Category = 'video' | 'article' | 'pdf' | 'social';

interface Resource {
  id: string;
  title: string;
  source: string;
  category: Category;
  added: string; // ISO date
  started: string | null;
  finished: string | null;
}

interface CategoryMeta {
  label: string;
  // tile color uses a fixed hue per category (categorical encoding, not accent drift)
  hue: string;
}

@Component({
  selector: 'app-resource-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-6 pb-24 pt-4">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h1 class="font-display text-3xl leading-none tracking-tight">Your lake</h1>
        <p class="label-mono">{{ resources().length }} resources</p>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (r of resources(); track r.id) {
          <article
            class="panel card-hover flex flex-col gap-5 px-5 py-5"
            [style.--cat]="meta[r.category].hue"
          >
            <!-- header row: big icon top-left + category chip top-right -->
            <div class="flex items-start justify-between gap-3">
              <span
                class="grid size-12 shrink-0 place-items-center rounded-[var(--radius-lg)]"
                [style.background]="'color-mix(in srgb, var(--cat) 14%, transparent)'"
                [style.color]="'var(--cat)'"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-6"
                >
                  @switch (r.category) {
                    @case ('video') {
                      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                      <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
                    }
                    @case ('article') {
                      <path d="M5 3.5h9l5 5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
                      <path d="M14 3.5V8a1 1 0 0 0 1 1h4M8 13h7M8 16.5h7M8 9.5h2" />
                    }
                    @case ('pdf') {
                      <path d="M5 3.5h9l5 5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
                      <path d="M14 3.5V8a1 1 0 0 0 1 1h4" />
                      <path d="M8 17v-4h1.5a1.2 1.2 0 0 1 0 2.4H8M13.5 17v-4h2M13.5 15h1.6" />
                    }
                    @case ('social') {
                      <path
                        d="M20 11.5a7.5 7.5 0 0 1-10.8 6.7L4 19.5l1.3-4.1A7.5 7.5 0 1 1 20 11.5Z"
                      />
                      <path d="M9 11h.01M12 11h.01M15 11h.01" />
                    }
                  }
                </svg>
              </span>

              <span
                class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
                [style.background]="'color-mix(in srgb, var(--cat) 12%, transparent)'"
                [style.color]="'var(--cat)'"
              >
                <span class="size-1.5 rounded-full" [style.background]="'var(--cat)'"></span>
                {{ meta[r.category].label }}
              </span>
            </div>

            <!-- title + source -->
            <div class="flex flex-col gap-1">
              <h2 class="font-display text-lg leading-snug">{{ r.title }}</h2>
              <p class="truncate text-sm text-muted-foreground">{{ r.source }}</p>
            </div>

            <!-- date timeline: added | started | finished -->
            <dl
              class="mt-auto grid grid-cols-3 gap-2 border-t border-[color:var(--border)] pt-4 text-center"
            >
              <div class="flex flex-col gap-1">
                <dt class="label-mono text-[0.625rem]">Added</dt>
                <dd class="text-sm">{{ fmt(r.added) }}</dd>
              </div>
              <div class="flex flex-col gap-1 border-x border-[color:var(--border)]">
                <dt class="label-mono text-[0.625rem]">Started</dt>
                <dd class="text-sm" [class.text-muted-foreground]="!r.started">
                  {{ r.started ? fmt(r.started) : '—' }}
                </dd>
              </div>
              <div class="flex flex-col gap-1">
                <dt class="label-mono text-[0.625rem]">Finished</dt>
                <dd class="text-sm" [class.text-muted-foreground]="!r.finished">
                  {{ r.finished ? fmt(r.finished) : '—' }}
                </dd>
              </div>
            </dl>
          </article>
        }
      </div>
    </section>
  `,
})
export class ResourceGrid {
  protected readonly meta: Record<Category, CategoryMeta> = {
    video: { label: 'Video', hue: '#e0598b' },
    article: { label: 'Article', hue: '#0d9488' },
    pdf: { label: 'PDF', hue: '#d97706' },
    social: { label: 'Social post', hue: '#7c6cf5' },
  };

  protected readonly resources = signal<Resource[]>([
    {
      id: '1',
      title: 'How rivers shape the land over millennia',
      source: 'youtube.com · Geo Channel',
      category: 'video',
      added: '2026-05-28',
      started: '2026-06-01',
      finished: '2026-06-02',
    },
    {
      id: '2',
      title: 'The quiet case for boring software',
      source: 'mattrickard.com',
      category: 'article',
      added: '2026-06-03',
      started: '2026-06-10',
      finished: null,
    },
    {
      id: '3',
      title: 'Attention Is All You Need',
      source: 'arxiv.org · 1706.03762',
      category: 'pdf',
      added: '2026-04-12',
      started: '2026-04-15',
      finished: '2026-05-09',
    },
    {
      id: '4',
      title: 'Thread: what I learned shipping 30 small apps',
      source: 'x.com · @indiehacker',
      category: 'social',
      added: '2026-06-11',
      started: null,
      finished: null,
    },
    {
      id: '5',
      title: 'Designing calm interfaces that respect attention',
      source: 'vimeo.com · Config talk',
      category: 'video',
      added: '2026-06-08',
      started: '2026-06-12',
      finished: null,
    },
    {
      id: '6',
      title: 'A field guide to typographic scale',
      source: 'practicaltypography.com',
      category: 'article',
      added: '2026-05-20',
      started: '2026-05-21',
      finished: '2026-05-24',
    },
  ]);

  protected fmt(iso: string): string {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
