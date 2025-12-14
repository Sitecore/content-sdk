export interface ServerSettings {
  enablePersonalizeCookie?: boolean;
}

export interface PersonalizeSettings {
  enablePersonalizeCookie?: boolean;
  cookieSettings: {
    name: {
      guestId: string;
    };
  };
}
