import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';

@Component({
  imports: [JsonPipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly authService = inject(AuthService);
  currentUser = this.authService.getUserProfile();
}
