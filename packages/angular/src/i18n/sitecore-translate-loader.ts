import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

/**
 * Default ngx-translate loader: phrases come from the route dictionary resolver, not HTTP.
 * Replace this provider if you need on-demand phrase fetching.
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecoreTranslateLoader implements TranslateLoader {
  /** @inheritdoc */
  getTranslation(lang: string): Observable<Record<string, string>> {
    void lang;
    return of({});
  }
}
