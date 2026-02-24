import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RichTextField,
  SitecoreContextService,
  RichTextComponent as CSDKRichTextComponent,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from './../sxa.component';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  standalone: true,
  imports: [CommonModule, CSDKRichTextComponent],
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

    effect(() => {
      const route = this.sitecoreContext.page()?.layout?.sitecore?.route;
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
