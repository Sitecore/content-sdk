import React from 'react';
import { ComponentParams, ComponentRendering, RichText, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  copyright: { value: string };
  socialLinks: { value: string };
  footerText: { value: string };
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const Footer = (props: FooterProps) => {
  const { copyright, socialLinks, footerText } = props.fields || {};

  return (
    <footer className="footer">
      <div className="footer-container">
        {footerText && (
          <div className="footer-text">
            <RichText field={footerText} />
          </div>
        )}
        {socialLinks && (
          <div className="footer-social">
            <RichText field={socialLinks} />
          </div>
        )}
        {copyright && (
          <div className="footer-copyright">
            <Text field={copyright} />
          </div>
        )}
      </div>
    </footer>
  );
};
