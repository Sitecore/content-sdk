export type WebPersonalizationSettings = { async: boolean; defer: boolean; language?: string };

export interface BrowserSettings {
  webPersonalization?: boolean | Partial<WebPersonalizationSettings>;
  enablePersonalizeCookie?: boolean;
}

export interface PersonalizeSettings {
  webPersonalization: false | WebPersonalizationSettings;
  enablePersonalizeCookie?: boolean;
  cookieSettings: {
    name: {
      guestId: string;
    };
  };
}
