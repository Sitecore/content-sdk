import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LinkField,
  TextField,
  ComponentFields,
  SitecoreContextService,
  ScTextDirective,
  ScLinkDirective,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  standalone: true,
  imports: [CommonModule, ScTextDirective, ScLinkDirective],
  host: {
    class: 'component title',
    '[class]': 'styles',
    '[id]': 'id',
  },
})
export class TitleComponent extends SxaComponent<ComponentFields> implements OnInit {
  text?: TextField;
  link?: LinkField;
  pageEditing = false;

  constructor(sitecoreContext: SitecoreContextService) {
    super();

    // React to context changes using effect
    effect(() => {
      const page = sitecoreContext.page();
      if (page) {
        this.pageEditing = page.mode?.isEditing ?? false;
        this.updateLinkForEditing(page.mode?.isNormal === false);
      }
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    const datasource =
      (this.rendering.fields as any)?.data?.datasource ||
      (this.rendering.fields as any)?.data?.contextItem;

    if (datasource) {
      this.text = datasource.field?.jsonValue;
      this.link = {
        value: {
          href: datasource?.url?.path,
          title: datasource?.field?.jsonValue?.value,
          text: datasource?.field?.jsonValue?.value,
        },
      };
    }
  }

  private updateLinkForEditing(isEditingMode: boolean): void {
    if (isEditingMode && this.link?.value) {
      const datasource =
        (this.rendering.fields as any)?.data?.datasource ||
        (this.rendering.fields as any)?.data?.contextItem;
      this.link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
      if (!this.text?.value) {
        if (this.text) {
          this.text.value = 'Title field';
        }
        this.link.value.href = '#';
      }
    }
  }
}
