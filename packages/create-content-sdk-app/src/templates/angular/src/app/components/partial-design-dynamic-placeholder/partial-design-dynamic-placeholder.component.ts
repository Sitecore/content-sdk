import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderComponent } from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-partial-design-dynamic-placeholder',
  templateUrl: './partial-design-dynamic-placeholder.component.html',
  standalone: true,
  imports: [CommonModule, PlaceholderComponent],
})
export class PartialDesignDynamicPlaceholderComponent extends SxaComponent implements OnInit {
  sig = '';

  override ngOnInit() {
    super.ngOnInit();
    this.sig = this.rendering.params?.sig || '';
  }
}
