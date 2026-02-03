import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxaComponent } from '../sxa.component';
import { PlaceholderComponent } from '@sitecore-content-sdk/angular';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  standalone: true,
  imports: [CommonModule, PlaceholderComponent],
})
export class ContainerComponent extends SxaComponent implements OnInit {
  placeholderName = '';
  wrapped = false;

  override ngOnInit() {
    super.ngOnInit();

    this.placeholderName = `container-${this.rendering.params?.DynamicPlaceholderId}`;
    this.wrapped = this.rendering.params?.Styles?.split(' ').includes('container') ?? false;
  }

  get backgroundStyle() {
    const backgroundImage = this.rendering.params?.BackgroundImage;
    const mediaUrlPattern = new RegExp(/mediaurl="([^"]*)"/, 'i');
    if (!backgroundImage || !backgroundImage.match(mediaUrlPattern)) {
      return {};
    }
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.[1];
    return {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }
}
