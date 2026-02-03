import { OnInit, Input, Directive } from '@angular/core';
import {
  ComponentFields,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/angular';

@Directive()
export abstract class SxaComponent<FieldType = ComponentFields> implements OnInit {
  @Input({ required: true }) rendering!: ComponentRendering<FieldType>;
  @Input() fields?: FieldType;
  @Input() params?: ComponentParams;

  id?: string;
  styles?: string;

  ngOnInit() {
    this.id = this.rendering.params?.RenderingIdentifier;
    this.styles = this.rendering.params?.styles;
  }
}
