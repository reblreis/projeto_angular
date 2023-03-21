import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';

const routes: Routes = [
  { path: 'admin-clientes', component: ClientesComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, //formulários reativos
    ReactiveFormsModule, //formulários reativos
    HttpClientModule, //executar chamadas para APIs
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RouterModule.forRoot(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
