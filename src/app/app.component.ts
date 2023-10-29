import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from './services/api.service';
import { AppUtility } from './apputitlity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent {
  title = 'flexy-angular';
  constructor(public _utility : AppUtility) {
  }
} 
