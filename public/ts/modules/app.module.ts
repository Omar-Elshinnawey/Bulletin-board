import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import 'hammerjs';
import {MaterialModule} from '@angular/material';
import { AppComponent, RegisterComponent, GroupComponent } from '../components';

import {RegisterService, ToastService, GroupService} from '../services';

@NgModule({
    imports: [BrowserModule,
                HttpModule,
                RouterModule,
                FormsModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot(),
                AppRoutingModule,
                MaterialModule],
    exports: [],
    declarations: [AppComponent,
                    RegisterComponent,
                    GroupComponent],
    bootstrap:[AppComponent],
    providers: [RegisterService,
                GroupService,
                ToastService],
})
export class AppModule { }
