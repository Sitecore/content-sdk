import { Pipe, PipeTransform, inject } from '@angular/core';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { prependLocale } from './locale-url';

/**
 * Prepends the active locale to router link targets when the locale is not the default.
 * Pass **canonical** paths (without an existing locale prefix).
 * @public
 */
@Pipe({
  name: 'localePath',
  standalone: true,
  pure: false,
})
export class LocalePathPipe implements PipeTransform {
  private readonly config = inject(SITECORE_CONFIG_TOKEN);
  private readonly context = inject(SitecoreContextService);

  /** @inheritdoc */
  transform(path: string): string;
  /** @inheritdoc */
  transform(path: unknown[]): unknown[];
  /** @inheritdoc */
  transform(path: string | unknown[]): string | unknown[] {
    const locale =
      this.context.locale() ?? this.config.defaultLanguage ?? 'en';
    const defaultLang = this.config.defaultLanguage ?? 'en';
    if (locale === defaultLang) {
      return path;
    }
    if (typeof path === 'string') {
      return prependLocale(path, locale, defaultLang);
    }
    if (!Array.isArray(path) || path.length === 0) {
      return path;
    }
    const first = path[0];
    if (typeof first === 'string' && first.startsWith('/') && !this.isExternal(first)) {
      const prefixed = prependLocale(first, locale, defaultLang);
      return [prefixed, ...path.slice(1)];
    }
    return ['/', locale, ...path];
  }

  private isExternal(segment: string): boolean {
    const lower = segment.toLowerCase();
    return (
      lower.startsWith('http://') ||
      lower.startsWith('https://') ||
      lower.startsWith('//')
    );
  }
}
