import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitecoreContextService } from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';
import { NavigationItemComponent } from './navigation-item.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  imports: [CommonModule, NavigationItemComponent],
  host: {
    class: 'component navigation',
    '[id]': 'id',
    '[class]': 'styles + " " + rendering.params?.GridParameters',
  },
})
export class NavigationComponent extends SxaComponent implements OnInit {
  isEditing = false;
  isOpenMenu = false;
  baseLevel = 1;

  constructor(sitecoreContext: SitecoreContextService) {
    super();

    // React to context changes using effect
    effect(() => {
      const page = sitecoreContext.page();
      this.isEditing = page?.mode?.isEditing ?? false;
    });
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  toggleMenu(event: Event, flag?: boolean) {
    if (event && this.isEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      this.isOpenMenu = flag;
    }

    this.isOpenMenu = !this.isOpenMenu;
  }
}
