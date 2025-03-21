import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth } from './auth/auth.provider';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAuth(), importProvidersFrom(NgxBootstrapIconsModule)]
};
