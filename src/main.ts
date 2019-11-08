import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as moment from 'moment';


//caduca el tkn
  const date = localStorage.getItem('hoy');
  const hoy = moment().format('DD/MM/YYYY');
   if(!(date===hoy)) localStorage.clear();

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
