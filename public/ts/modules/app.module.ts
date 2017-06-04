import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { AppComponent } from '../components';

@NgModule({
    imports: [BrowserModule],
    exports: [],
    declarations: [AppComponent],
    bootstrap:[AppComponent],
    providers: [],
})
export class AppModule { }
