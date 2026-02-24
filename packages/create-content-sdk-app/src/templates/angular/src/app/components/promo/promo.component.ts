import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ImageComponent,
  RichTextComponent,
  LinkComponent,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  standalone: true,
  imports: [CommonModule, ImageComponent, RichTextComponent, LinkComponent],
  host: {
    class: 'component promo',
    '[class]': 'styles',
    '[id]': 'id',
  },
})
export class PromoComponent extends SxaComponent {}
