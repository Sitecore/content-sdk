import { Component, computed } from '@angular/core';
import { NgTemplateOutlet, NgStyle } from '@angular/common';
import { ScPlaceholderComponent } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

const mediaUrlPattern = /mediaurl="([^"]*)"/i;

@Component({
  selector: 'app-container',
  imports: [NgTemplateOutlet, NgStyle, ScPlaceholderComponent],
  template: `
    @if (needsWrapper()) {
      <div class="container-wrapper">
        <ng-container *ngTemplateOutlet="containerInner"></ng-container>
      </div>
    } @else {
      <ng-container *ngTemplateOutlet="containerInner"></ng-container>
    }

    <ng-template #containerInner>
      <section [attr.class]="('component container-default ' + styles()).trim()" [attr.id]="renderingId()">
        <div class="component-content" [ngStyle]="backgroundStyle()">
          <div class="row">
            @if (placeholderName()) {
              <sc-placeholder [name]="placeholderName()!" [rendering]="rendering()!"></sc-placeholder>
            }
          </div>
        </div>
      </section>
    </ng-template>
  `,
})
export class ContainerComponent extends SxaComponent {
  readonly needsWrapper = computed(() => {
    const tokens = this.styles()?.split(/\s+/).filter(Boolean) ?? [];
    return tokens.includes('container');
  });

  readonly placeholderName = computed(() => {
    const id = this.params()?.DynamicPlaceholderId?.trim();
    return id ? `container-${id}` : '';
  });

  readonly backgroundStyle = computed((): { [key: string]: string } => {
    const backgroundImage = this.params()?.BackgroundImage;
    if (!backgroundImage || !mediaUrlPattern.test(backgroundImage)) {
      return {};
    }
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.at(1) ?? '';
    if (!mediaUrl) {
      return {};
    }
    return {
      backgroundImage: `url('${mediaUrl}')`,
    };
  });
}
