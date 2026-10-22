import { MediaMatcher } from '@angular/cdk/layout';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';
import { sidenavItems } from './sidenav-items';
import { UserMenu } from './user-menu/user-menu';

@Component({
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    UserMenu,
  ],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnDestroy {
  private readonly isMobile = signal<boolean>(false);
  private readonly mobileQuery: MediaQueryList;
  private readonly mobileQueryListener: () => void;
  private readonly authService = inject(AuthService);

  sidebarItems = computed(() => {
    const userRoles = this.authService.getRoles();
    return sidenavItems.filter((item) => item.roles.some((role) => userRoles.includes(role)));
  });

  constructor() {
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this.mobileQuery.matches);
    this.mobileQueryListener = () => this.isMobile.set(this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }
}
