import { Injectable, inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import debug from '../debug';

/**
 * `ngx-translate` loader using Sitecore dictionary from {@link SitecoreContextService}.
 * Requires a `dictionaryLoader` resolver on the active route — without it, `dictionary()`
 * is `null` and translations resolve to `{}`.
 * @public
 */
@Injectable()
export class SitecoreTranslateLoader implements TranslateLoader {
  private readonly context = inject(SitecoreContextService);

  /**
   * Returns the translation based on the dictionary in the context from {@link SitecoreContextService}.
   * @returns {Observable<Record<string, string>>} Observable of translation dictionary.
   */
  getTranslation(): Observable<Record<string, string>> {
    const dictionary = this.context.dictionary();
    debug.dictionary('ngx translate uses dictionary', dictionary);
    return of(dictionary ?? {});
  }
}
