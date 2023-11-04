import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

const exportsharedata: any = [
  ReactiveFormsModule,
  FormsModule,
  MatDatepickerModule,
  ToastModule,
  KeyFilterModule,
  InputTextModule,
  SidebarModule,
  ButtonModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...exportsharedata
  ],

  exports: [...exportsharedata]
})
export class SharedModule { }
