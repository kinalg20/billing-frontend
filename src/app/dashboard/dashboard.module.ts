import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoFlexyModule } from '../demo-flexy-module'
import { DashboardComponent } from './dashboard.component';
import { SalesComponent } from './dashboard-components/sales/sales.component';
import { ActivityComponent } from './dashboard-components/activity/activity.component';
import { ProductComponent } from './dashboard-components/product/product.component';
import { CardsComponent } from './dashboard-components/cards/cards.component';
import { FormsModule } from '@angular/forms';
import { BillComponent } from './dashboard-components/bill/bill.component';
import { CalendarModule } from 'primeng/calendar';

const exportData : any = [
  DashboardComponent,
  SalesComponent,
  ActivityComponent,
  ProductComponent,
  BillComponent
]


@NgModule({
  declarations: [
    DashboardComponent,
    SalesComponent,
    ActivityComponent,
    ProductComponent,
    CardsComponent,
    BillComponent
  ],
  imports: [
    CommonModule,
    DemoFlexyModule,
    FormsModule,
    CalendarModule
  ],
  exports: [
    ...exportData
  ]
})
export class DashboardModule { }
