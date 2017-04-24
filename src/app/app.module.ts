import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {CartsModule} from "./carts/carts";
import {CabinComponent} from "./cabin/cabin";

@NgModule({
  declarations: [
    AppComponent,
    CabinComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    CartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
