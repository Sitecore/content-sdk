import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Field,
  LinkField,
  ComponentFields,
  TextComponent,
  LinkComponent,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  standalone: true,
  imports: [CommonModule, TextComponent, LinkComponent],
  host: {
    class: 'component link-list',
    '[class]': 'styles',
    '[attr.id]': 'id',
  },
})
export class LinkListComponent extends SxaComponent<ComponentFields> implements OnInit {
  title?: Field<string>;
  fieldLinks: LinkField[] = [];

  getFieldLinkClass(index: number): string {
    let className = `item${index}`;
    className += (index + 1) % 2 === 0 ? ' even' : ' odd';
    if (index === 0) {
      className += ' first';
    }
    if (index + 1 === this.fieldLinks.length) {
      className += ' last';
    }
    return className;
  }

  override ngOnInit() {
    super.ngOnInit();
    const datasource = (this.rendering.fields as any)?.data?.datasource;
    if (datasource) {
      this.title = datasource.field?.title as Field<string>;
      datasource.children.results.forEach((item: any) => {
        if (item.field?.link) this.fieldLinks.push(item.field.link as LinkField);
      });
    }
  }
}
