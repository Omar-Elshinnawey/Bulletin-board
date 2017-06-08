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
import { AppComponent, RegisterComponent, GroupComponent, NotesComponent } from '../components';

import {RegisterService, ToastService, GroupService, IOService, NotesService} from '../services';

@NgModule({
    imports: [BrowserModule,
                HttpModule,
                RouterModule,
                FormsModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot(),
                AppRoutingModule,
                MaterialModule],
    declarations: [AppComponent,
                    RegisterComponent,
                    GroupComponent,
                    NotesComponent],
    bootstrap:[AppComponent],
    providers: [RegisterService,
                GroupService,
                ToastService,
                IOService,
                NotesService],
})
export class AppModule { }
