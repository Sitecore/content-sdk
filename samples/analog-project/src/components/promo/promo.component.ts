import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ScImageDirective,
  ScRichTextDirective,
  ScLinkDirective,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  standalone: true,
  imports: [CommonModule, ScImageDirective, ScRichTextDirective, ScLinkDirective],
  host: {
    class: 'component promo',
    '[class]': 'styles',
    '[id]': 'id',
  },
})
export class PromoComponent extends SxaComponent {}
