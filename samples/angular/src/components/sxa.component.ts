import { OnInit, Input, Directive } from '@angular/core';
import { ComponentFields, ComponentRendering } from '@sitecore-content-sdk/angular';

@Directive()
export abstract class SxaComponent<FieldType = ComponentFields> implements OnInit {
  @Input({ required: true }) rendering!: ComponentRendering<FieldType>;

  id?: string;
  styles?: string;

  ngOnInit() {
    this.id = this.rendering.params?.RenderingIdentifier;
    this.styles = this.rendering.params?.styles;
  }
}
