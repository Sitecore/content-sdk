import { Injectable, inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SitecoreContextService } from '../lib/sitecore-context.service';

@Injectable()
export class SitecoreTranslateLoader implements TranslateLoader {
  private readonly context = inject(SitecoreContextService);

  getTranslation(): Observable<Record<string, string>> {
    const dictionary = this.context.dictionary();
    return of(dictionary ?? {});
  }
}
