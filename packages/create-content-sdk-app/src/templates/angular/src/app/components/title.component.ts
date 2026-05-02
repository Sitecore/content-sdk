import { Component, computed, inject } from '@angular/core';
import { Field, LinkField, ScLinkDirective, ScTextDirective, SitecoreContextService } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

interface GraphqlItem {
  url?: { path?: string; siteName?: string };
  field?: { jsonValue?: unknown };
}

interface TitleFields {
  data?: { datasource?: GraphqlItem; contextItem?: GraphqlItem };
}

@Component({
  selector: 'app-title',
  imports: [ScTextDirective, ScLinkDirective],
  template: `
    <div [attr.class]="('component title ' + styles()).trim()" [attr.id]="renderingId()">
      <div class="component-content">
        <div class="field-title">
          @if (isEditing()) {
            <span [scText]="titleField()"></span>
          } @else {
            <a [scLink]="titleLinkField()"><span [scText]="titleField()"></span></a>
          }
        </div>
      </div>
    </div>
  `,
})
export class TitleComponent extends SxaComponent {
  private readonly context = inject(SitecoreContextService);

  readonly data = computed(() => (this.fields() as TitleFields)?.data);

  readonly datasource = computed(() => this.data()?.datasource || this.data()?.contextItem);

  readonly titleField = computed((): Field<string> | undefined => {
    const jsonVal = this.datasource()?.field?.jsonValue as Field<string> | undefined;
    if (jsonVal) {
      return jsonVal;
    }
    const route = this.context.page()?.layout?.sitecore?.route;
    return route?.fields?.Title as Field<string> | undefined;
  });

  readonly titleLinkField = computed((): LinkField => {
    const graphqlSource = this.datasource();
    const resolvedTitleField = this.titleField();
    const href = graphqlSource?.url?.path;
    const rawJson = graphqlSource?.field?.jsonValue as { value?: string } | undefined;
    return {
      value: {
        href,
        title:
          (resolvedTitleField?.value != null ? String(resolvedTitleField.value) : undefined) ||
          rawJson?.value,
      },
    };
  });

  readonly isEditing = computed(() => this.context.isEditing());
}
