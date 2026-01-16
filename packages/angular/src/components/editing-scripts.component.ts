import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { getContentSdkPagesClientData } from '@sitecore-content-sdk/core/editing';
import { DOCUMENT } from '@angular/common';
import { isServer } from '@sitecore-content-sdk/core/utils';
import { SitecoreContextService } from '../lib/sitecore-context.service';

/**
 * Component that renders editing scripts and client data for the current page in Sitecore Editor.
 * Only renders scripts when Metadata mode is used.
 */
@Component({
  selector: 'sc-editing-scripts',
  template: '',
  standalone: true,
})
export class EditingScriptsComponent implements OnInit {
  private readonly renderer = inject(Renderer2);
  private readonly sitecoreContextService = inject(SitecoreContextService);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    const { layout, mode } = this.sitecoreContextService.getPage() || {};
    if (mode?.isEditing && isServer()) {
      const { clientData, clientScripts } = layout?.sitecore?.context || {};
      const jssClientData = { ...clientData, ...getContentSdkPagesClientData() };
      clientScripts?.forEach((src: string) => {
        const scriptElement = this.renderer.createElement('script');
        scriptElement.src = src;
        this.renderer.appendChild(this.document.body, scriptElement);
      });

      Object.keys(jssClientData).forEach((id: string) => {
        const scriptElement = this.renderer.createElement('script');
        scriptElement.id = id;
        scriptElement.type = 'application/json';
        scriptElement.innerHTML = JSON.stringify(jssClientData[id]);
        this.renderer.appendChild(this.document.body, scriptElement);
      });
    }
  }
}
