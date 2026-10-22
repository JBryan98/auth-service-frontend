import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb';
import { Breadcrumb } from './breadcrumb/breadcrumb';

@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterOutlet,
    RouterOutlet,
    Breadcrumb,
  ],
  selector: 'app-page-header-layout',
  styleUrl: './page-header-layout.css',
  templateUrl: './page-header-layout.html',
})
export class PageHeaderLayout {
  readonly breadcrumbService = inject(BreadcrumbService);
  readonly crumbs = this.breadcrumbService.crumbs;
  readonly pageTitle = this.breadcrumbService.pageTitle;
}
