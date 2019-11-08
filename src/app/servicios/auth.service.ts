import { Injectable } from '@angular/core';
import { Sesion } from '../comun/sesion';
//import { Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { Global } from '../comun/global';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SwPush, SwUpdate } from "@angular/service-worker";

import { SserService } from "./sser.service";

@Injectable()
export class AuthService {

  headers = new Headers();
  // options: RequestOptions;

  id: string;
  data: any;
  global: Global = new Global();



  constructor(private httpClient: HttpClient, private swPush: SwPush, private sser: SserService) {
    this.headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    });
  }

  login(user: string, password: string) {

    const hash = Md5.hashStr(password);
    const sesion = new Sesion();
    sesion.usuario = user;
    sesion.hash = hash.toString();

    //console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCondS.php?sesion=' + JSON.stringify(sesion));
    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCondS.php?sesion='
      + encodeURIComponent(JSON.stringify(sesion)))
      .map(result => {

        
        if(result && result.hasOwnProperty('id')){
          return 'NOK';
        }else{
          this.data = result[0];
          sesion.usuario = user;
          localStorage.setItem('username', user);
          localStorage.setItem('idConductor', this.data.idConductor);
          localStorage.setItem('nombre', this.data.nombre);
          localStorage.setItem('idCompania', this.data.idCompania);
          localStorage.setItem('email', this.data.email);
          localStorage.setItem('tipo', '5');
          localStorage.setItem('hoy', moment().format('DD/MM/YYYY'));
          localStorage.setItem('matricula', this.data.matricula);
          localStorage.setItem('vehiculo', this.data.vehiculo);
          localStorage.setItem('idVehiculo', this.data.idVehiculo);
          localStorage.setItem('sub', this.data.sub);
          localStorage.setItem('telefono', this.data.telefono);
          
          console.log('::::::::::::: SUSCRIBIR :::::::::::::::::::::');
          if(!this.data.sub){
            let tmp = localStorage.getItem('Tmpsub');
            if(tmp){
              localStorage.setItem('sub', tmp);
              let a = { idConductor: localStorage.getItem('idConductor')}; 
              this.sser.addPushSubscriber(JSON.stringify(a),tmp).subscribe();
              console.log('::::::::::::: guardo sus :::::::::::::::::::::');
            } 
          }else{
            console.log('::::::::::::: recupero sus :::::::::::::::::::::');
          }
          console.log('::::::::::::: END SUSCRIBIR :::::::::::::::::::::');
        }
        return this.data.id;
      });

  }

  logout(): any {
    localStorage.clear();
  }
  getUser(): any {
    return localStorage.getItem('username');
  }
  getId(): any {
    return localStorage.getItem('id');
  }
  getTipo(): any {
    return localStorage.getItem('tipo');
  }
  isLoggedIn(): boolean {
    //console.log('----->>>>');
    return this.getUser() !== null;
  }

}
export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
