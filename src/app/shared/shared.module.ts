import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';


const exportsharedata: any = [
  ReactiveFormsModule,
  FormsModule,
  MatDatepickerModule,
  ToastModule,
  KeyFilterModule,
  InputTextModule
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
