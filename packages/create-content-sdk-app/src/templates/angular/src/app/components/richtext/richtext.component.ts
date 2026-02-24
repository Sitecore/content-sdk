import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextField, RichTextComponent as CSDKRichTextComponent } from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  standalone: true,
  imports: [CommonModule, CSDKRichTextComponent],
  host: {
    class: 'component rich-text',
    '[class]': 'styles',
    '[attr.id]': 'id',
  },
})
export class RichTextComponent extends SxaComponent implements OnInit {
  text?: RichTextField;

  override ngOnInit() {
    super.ngOnInit();
    this.text = this.rendering.fields?.Text as RichTextField;
  }
}
