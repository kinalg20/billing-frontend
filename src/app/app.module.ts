import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullComponent } from './layouts/full/full.component';
import { DemoFlexyModule } from './demo-flexy-module'

// Modules
import { DashboardModule } from './dashboard/dashboard.module';
import { ComponentsModule } from './components/components.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './Interceptor/interceptor';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    DashboardModule,
    HttpClientModule,
    ComponentsModule,
    MessagesModule,
    ToastModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [MessageService , { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
