﻿import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RichTextField,
  SitecoreContextService,
  ScRichTextDirective,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from './../sxa.component';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  standalone: true,
  imports: [CommonModule, ScRichTextDirective],
  host: {
    class: 'component content',
    '[class]': 'styles',
    '[id]': 'id',
  },
})
export class PageContentComponent extends SxaComponent implements OnInit {
  content?: RichTextField;
  contextContent?: RichTextField;

  constructor(private sitecoreContext: SitecoreContextService) {
    super();

    // React to context changes using effect
    effect(() => {
      const route = this.sitecoreContext.route();
      if (route?.fields?.Content) {
        this.contextContent = route.fields.Content as RichTextField;
      }
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.content = this.rendering.fields?.Content as RichTextField;
  }
}
