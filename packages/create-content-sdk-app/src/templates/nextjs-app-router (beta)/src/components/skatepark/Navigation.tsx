import React from 'react';
import { ComponentParams, ComponentRendering, Link, Text } from '@sitecore-content-sdk/nextjs';

interface NavLink {
  id: string;
  url: string;
  name: string;
  fields: {
    navigationTitle: { value: string };
  };
}

interface Fields {
  logo: { value: string };
  navigationLinks: NavLink[];
}

type NavigationProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const Navigation = (props: NavigationProps) => {
  const { logo, navigationLinks } = props.fields || {};

  return (
    <nav className="navigation">
      <div className="nav-container">
        {logo && <Text tag="div" className="nav-logo" field={logo} />}
        {navigationLinks && navigationLinks.length > 0 && (
          <ul className="nav-links">
            {navigationLinks.map((link: NavLink) => (
              <li key={link.id} className="nav-item">
                <Link field={{ value: { href: link.url, text: link.name } }} className="nav-link" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};
