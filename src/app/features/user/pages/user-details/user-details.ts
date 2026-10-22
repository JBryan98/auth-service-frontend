import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../../../shared/components/alert/alert';

@Component({
  imports: [Alert, JsonPipe],
  selector: 'app-user-details',
  styleUrl: './user-details.css',
  templateUrl: './user-details.html',
})
export class UserDetails {
  userResource = inject(ActivatedRoute).resources?.["user"];
}
