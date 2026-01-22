import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Shell component that serves as the root layout for all routes.
 * In Analog, dictionary data is loaded per-page in the .server.ts files
 * and set in the page component, so the shell just provides the router outlet.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class ShellComponent {}
