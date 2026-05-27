import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface AdminEntry {
  key: string;
  tags: string[];
  storedAt: number;
  expiresAt: number | null;
  stale: boolean;
  approxBytes: number;
}

interface EntriesResponse {
  entries: AdminEntry[];
  now: number;
}

interface ConfigResponse {
  namespace: string;
  revalidate: number;
  enabled: boolean;
  loaders: Record<string, unknown>;
  defaultSiteName: string;
  backend: 'memory' | 'unstorage';
}

const ADMIN_BASE = '/api/_cache';

/**
 * Demo page that lists loader-cache entries and supports tag-based invalidation (Phase 3 OSR).
 */
@Component({
  selector: 'app-cache-demo',
  standalone: true,
  imports: [DatePipe, DecimalPipe, FormsModule],
  template: `
    <section class="cache-demo">
      <header>
        <h1>Loader cache</h1>
        @if (config(); as c) {
          <p class="backend">
            backend: <strong>{{ c.backend }}</strong>
            &middot; revalidate: <strong>{{ c.revalidate }}</strong>s
            &middot; defaultSite: <strong>{{ c.defaultSiteName }}</strong>
            @if (c.namespace) {
              &middot; namespace: <strong>{{ c.namespace }}</strong>
            }
          </p>
        }
        <p class="hint">
          Entries use <code>sc:loader:…</code> keys and Sitecore OSR tags. Invalidate marks entries
          <em>stale</em> (SWR); the next request serves last-known-good while refreshing.
        </p>
      </header>

      <div class="toolbar">
        <button type="button" (click)="refresh()" [disabled]="loading()">Refresh</button>
        <button type="button" (click)="flush()" [disabled]="loading() || entries().length === 0">
          Flush all
        </button>
        @if (lastMessage()) {
          <span class="status">{{ lastMessage() }}</span>
        }
      </div>

      <form class="invalidate" (submit)="invalidate($event)">
        <fieldset>
          <legend>Invalidate by tag</legend>
          <label>
            Tags (comma-separated)
            <input
              type="text"
              name="tags"
              [(ngModel)]="invalidateTags"
              placeholder="sc:item:…, sc:site:demo"
              required
            />
          </label>
          <button type="submit" [disabled]="loading() || !invalidateTags.trim()">Mark stale</button>
        </fieldset>
      </form>

      @if (!loading() && entries().length > 0) {
        <div class="meta">
          Total entries: <strong>{{ entries().length }}</strong>
          &middot; stale: <strong>{{ staleCount() }}</strong>
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading…</div>
      } @else if (entries().length === 0) {
        <div class="empty">No cache entries yet. Visit a page first.</div>
      } @else {
        <ul class="entries">
          @for (entry of entries(); track entry.key) {
            <li [class.stale]="entry.stale">
              <div class="key">{{ entry.key }}</div>
              <div class="tags">
                @for (t of entry.tags; track t) {
                  <span class="tag">{{ t }}</span>
                }
              </div>
              <div class="meta-row">
                <span>stored: {{ entry.storedAt | date: 'medium' }}</span>
                @if (entry.expiresAt) {
                  <span>expires: {{ entry.expiresAt | date: 'medium' }}</span>
                } @else {
                  <span>expires: never</span>
                }
                @if (entry.stale) {
                  <span class="stale-badge">stale</span>
                }
              </div>
              <div class="actions">
                <button type="button" (click)="invalidateEntry(entry)" [disabled]="loading()">
                  Mark this entry stale
                </button>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [
    `
      .cache-demo { padding: 1.5rem; font-family: ui-sans-serif, system-ui, sans-serif; }
      .backend { color: #444; font-size: .9rem; margin-top: .25rem; }
      .hint { color: #666; max-width: 60ch; }
      .toolbar { display: flex; gap: .5rem; align-items: center; margin: 1rem 0; }
      .toolbar .status { color: #2a7; font-size: .9rem; }
      .invalidate fieldset { display: flex; flex-wrap: wrap; gap: .75rem; align-items: end; }
      .invalidate label { display: flex; flex-direction: column; font-size: .85rem; color: #444; }
      .invalidate input { padding: .25rem .5rem; min-width: 16rem; }
      .meta { color: #666; margin: .75rem 0; font-size: .9rem; }
      .loading, .empty { color: #888; padding: 1rem 0; }
      .entries { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .75rem; }
      .entries li { border: 1px solid #ddd; padding: .75rem; border-radius: 6px; background: #fafafa; }
      .entries li.stale { border-color: #c90; background: #fffbeb; }
      .key { font-family: ui-monospace, Consolas, monospace; font-size: .85rem; word-break: break-all; }
      .tags { margin: .35rem 0; display: flex; flex-wrap: wrap; gap: .25rem; }
      .tag { font-size: .7rem; background: #eef; padding: .1rem .4rem; border-radius: 3px; font-family: ui-monospace, Consolas, monospace; }
      .meta-row { display: flex; gap: 1rem; font-size: .8rem; color: #555; margin-top: .25rem; align-items: center; }
      .stale-badge { color: #a60; font-weight: 600; }
      .actions { margin-top: .5rem; }
      button { padding: .35rem .75rem; cursor: pointer; }
      button:disabled { opacity: .5; cursor: not-allowed; }
    `,
  ],
})
export class CacheDemoComponent {
  private http = inject(HttpClient);

  readonly entries = signal<AdminEntry[]>([]);
  readonly config = signal<ConfigResponse | null>(null);
  readonly loading = signal(false);
  readonly lastMessage = signal<string>('');
  readonly staleCount = computed(() => this.entries().filter((e) => e.stale).length);

  invalidateTags = '';

  constructor() {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const [entries, config] = await Promise.all([
        firstValueFrom(this.http.get<EntriesResponse>(`${ADMIN_BASE}/entries`)),
        firstValueFrom(this.http.get<ConfigResponse>(`${ADMIN_BASE}/config`)),
      ]);
      this.entries.set(
        entries.entries.map((e) => ({
          ...e,
          approxBytes: e.key.length * 2,
        }))
      );
      this.config.set(config);
      this.lastMessage.set('');
    } catch (err) {
      this.lastMessage.set(`Refresh failed: ${(err as Error).message}`);
    } finally {
      this.loading.set(false);
    }
  }

  async flush(): Promise<void> {
    if (!confirm('Flush every cache entry?')) return;
    this.loading.set(true);
    try {
      await firstValueFrom(this.http.post(`${ADMIN_BASE}/flush`, {}));
      this.lastMessage.set('Flushed.');
      await this.refresh();
    } finally {
      this.loading.set(false);
    }
  }

  async invalidate(event: Event): Promise<void> {
    event.preventDefault();
    const tags = this.invalidateTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) return;

    this.loading.set(true);
    try {
      const resp = await firstValueFrom(
        this.http.post<{ marked: number }>(`${ADMIN_BASE}/invalidate`, { tags })
      );
      this.lastMessage.set(`Marked ${resp.marked} entr${resp.marked === 1 ? 'y' : 'ies'} stale.`);
      await this.refresh();
    } catch (err) {
      this.lastMessage.set(`Invalidate failed: ${(err as Error).message}`);
    } finally {
      this.loading.set(false);
    }
  }

  async invalidateEntry(entry: AdminEntry): Promise<void> {
    this.loading.set(true);
    try {
      const resp = await firstValueFrom(
        this.http.post<{ marked: number }>(`${ADMIN_BASE}/invalidate`, { tags: [entry.key] })
      );
      this.lastMessage.set(`Marked ${resp.marked} entr${resp.marked === 1 ? 'y' : 'ies'} stale.`);
      await this.refresh();
    } finally {
      this.loading.set(false);
    }
  }
}
