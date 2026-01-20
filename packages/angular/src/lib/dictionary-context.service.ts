import { Injectable, signal, Signal } from '@angular/core';
import { DictionaryPhrases } from '@sitecore-content-sdk/core/i18n';

/**
 * Service that provides access to dictionary phrases loaded by the dictionary resolver.
 * Use this service to access translated strings throughout the application.
 * @public
 */
@Injectable({
  providedIn: 'root',
})
export class DictionaryContextService {
  /**
   * Read-only signal for the current dictionary phrases.
   */
  readonly phrases: Signal<DictionaryPhrases>;

  /**
   * Internal signal holding the dictionary phrases
   */
  private readonly _phrases = signal<DictionaryPhrases>({});

  constructor() {
    this.phrases = this._phrases.asReadonly();
  }

  /**
   * Set the dictionary phrases.
   * Call this when dictionary data is loaded (e.g., in a route resolver or root component).
   * @param {DictionaryPhrases} phrases The dictionary phrases to set
   */
  setPhrases(phrases: DictionaryPhrases): void {
    this._phrases.set(phrases);
  }

  /**
   * Get a translated phrase by key.
   * Returns the key itself if no translation is found.
   * @param {string} key The dictionary key
   * @param {string} [defaultValue] Optional default value if key not found
   * @returns {string} The translated phrase or the key/default value
   */
  translate(key: string, defaultValue?: string): string {
    return this._phrases()[key] ?? defaultValue ?? key;
  }

  /**
   * Get a translated phrase by key (alias for translate).
   * @param {string} key The dictionary key
   * @param {string} [defaultValue] Optional default value if key not found
   * @returns {string} The translated phrase or the key/default value
   */
  t(key: string, defaultValue?: string): string {
    return this.translate(key, defaultValue);
  }
}
