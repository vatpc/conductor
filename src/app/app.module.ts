import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LogInGuard } from './log-in-guard.guard';
import { AUTH_PROVIDERS} from './servicios/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { CalendarModule, Schedule } from 'primeng/primeng';
import {ColorPickerModule} from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import {ListboxModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/multiselect';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputMaskModule} from 'primeng/inputmask';
import {TableModule} from 'primeng/table';
import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import { ScheduleModule } from 'primeng/primeng';
import { AgmCoreModule } from '@agm/core';
import { ServActComponent } from './serv-act/serv-act.component';
import { ListServComponent } from './list-serv/list-serv.component';
import { HorarioComponent } from './horario/horario.component';
import { ResGanComponent } from './res-gan/res-gan.component';
import { ServAsignComponent } from './serv-asign/serv-asign.component';
import { NotificComponent } from './notific/notific.component';
import {CardModule} from 'primeng/card';
import { VtcComponent } from './vtc/vtc.component';
import { ListDetComponent } from './list-serv/list-det/list-det.component';
import { LoginCondComponent } from './login-cond/login-cond.component';
import { UrgentesComponent } from './urgentes/urgentes.component';
import {SidebarModule} from 'primeng/primeng';
import { ServUrgComponent } from './serv-urg/serv-urg.component';
import { AsgVehComponent } from './asg-veh/asg-veh.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { DetSerComponent } from './list-serv/list-det/det-ser/det-ser.component';
import { ListHorarioComponent } from './horario/list-horario/list-horario.component';
import { NuevoHorarioComponent } from './horario/nuevo-horario/nuevo-horario.component';
import { AlertasComponent } from './alertas/alertas.component';
import { NewAleComponent } from './alertas/new-ale/new-ale.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SserService } from "./servicios/sser.service";
import { SwPush, SwUpdate } from "@angular/service-worker";
import {MessageService} from 'primeng/components/common/messageservice';
//import {ToastModule} from 'primeng/toast';
import * as $ from 'jquery';
import { MapaCliComponent } from './mapa-cli/mapa-cli.component';
import { LogAutComponent } from './log-aut/log-aut.component';



const routes: Routes = [
  { path: '', component:  HomeComponent, canActivate: [ LogInGuard ]},
  { path: 'loginCond', component: LoginCondComponent},
  { path: 'log', component: LogAutComponent},
  { path: 'servicioActual', component: ServActComponent, canActivate: [ LogInGuard ]},
  { path: '**', component: HomeComponent, canActivate: [ LogInGuard ]}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServActComponent,
    ListServComponent,
    HorarioComponent,
    ResGanComponent,
    ServAsignComponent,
    NotificComponent,
    VtcComponent,
    ListDetComponent,
    LoginCondComponent,
    UrgentesComponent,
    ServUrgComponent,
    AsgVehComponent,
    DetSerComponent,
    ListHorarioComponent,
    NuevoHorarioComponent,
    AlertasComponent,
    NewAleComponent,
    MapaCliComponent,
    LogAutComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD4ZEK6-JONSttoEjfuzRIArHHPHlmQ27E',
      libraries: ['places']
    }),
    BrowserModule,
    ConfirmDialogModule,
    PanelModule,
    CardModule,
    SidebarModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FormsModule,
    CalendarModule,
    ColorPickerModule,
    CheckboxModule,
    ListboxModule,
    HttpClientModule,
    ScheduleModule,
    MultiSelectModule,
    MessagesModule,
    MessageModule,
    InputMaskModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    //ToastModule,
    TableModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AUTH_PROVIDERS,
    LogInGuard,
    ConfirmationService,
    SserService,
    SwPush,
    SwUpdate
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
