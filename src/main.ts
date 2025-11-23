/// <reference types="@angular/localize" />
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';        // optional example
import { provideHttpClient } from '@angular/common/http';  // functional provider
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent,{
  providers: [
    provideHttpClient() // functional provider
    , provideRouter(routes)
  ]
})
  .catch((err) => console.error(err));
