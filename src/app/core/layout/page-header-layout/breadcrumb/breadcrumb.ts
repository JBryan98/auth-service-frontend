import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Crumb } from '../../../interface/breadcrumb';

@Component({
  imports: [MatIconModule, RouterLink],
  selector: 'app-breadcrumb',
  styleUrl: './breadcrumb.css',
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  crumbs = input.required<Crumb[]>();
}