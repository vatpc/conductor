import { Injectable } from '@angular/core';
import { Sesion } from '../comun/sesion';
//import { Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { Global } from '../comun/global';
import * as moment from 'moment';
import { Propietario } from '../comun/propietario';
import { HttpClient, HttpHeaders } from "@angular/common/http";



@Injectable()
export class AuthAdminService {

  headers = new Headers();

  id: string;
  data: any;
  global: Global = new Global();

  login(user: string, password: string, propietario: Propietario) {

    const hash = Md5.hashStr(password);
    const sesion = new Sesion();
    sesion.usuario = user;
    sesion.hash = hash.toString();
    sesion.conductor = propietario.userCond;



    console.log(this.global.SERVIDOR_URL+ this.global.CON_SCRIPTS + '/mantSesion/sesionCondAdmS.php?sesion=' + JSON.stringify(sesion));
    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCondAdmS.php?sesion='
      + encodeURIComponent(JSON.stringify(sesion)))
      .map(result => {
 
          if(result && result.hasOwnProperty('id')){
            return 'NOK';
          }else{
            this.data = result[0];
          sesion.usuario = user;
          if (this.global.USER_ADMIN == sesion.usuario) localStorage.setItem('condSupl', sesion.conductor);
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
          localStorage.setItem('telefono', this.data.telefono);

        }
        return this.data.id;
      });

  }
  loginCoor(user: string, password: string) {

    const hash = Md5.hashStr(password);
    const sesion = new Sesion();
    sesion.usuario = user;
    sesion.hash = hash.toString();


    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCoordS.php?sesion=' + JSON.stringify(sesion));
    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCoordS.php?sesion=' +
      encodeURIComponent(JSON.stringify(sesion)))
      .map(result1 => {
        if(result1 && result1.hasOwnProperty('id')){
          return 'NOK';
        }else{
          let data1 = result1[0];
          if (data1 && data1.id !== 'NOK') {
            localStorage.setItem('usernameCoord', user); 
            localStorage.setItem('username', user);  
            localStorage.setItem('idCompania', data1.idCompania); 
            localStorage.setItem('coord', 'COORDINADOR');    
          }
          return data1.idCompania;
        }
      });

  }
  loginCoor_(idCompania: string){
    let compania = { 'idCompania': localStorage.getItem('idCompania') };
    //console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS +'/mantSesion/sesionCoordS1.php?compania='+JSON.stringify(compania)));
    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS +'/mantSesion/sesionCoordS1.php?compania=' + encodeURIComponent(JSON.stringify(compania)))
    .map(result => {
        this.data = result[0];

        if (this.data.idConductor !== 'NOK') {
            localStorage.setItem('username', this.data.email);
            localStorage.setItem('idConductor', this.data.idConductor);
            localStorage.setItem('nombre', this.data.nombre);
            localStorage.setItem('idCompania', this.data.idCompania);
            localStorage.setItem('email', this.data.email);
            localStorage.setItem('tipo', '5');
            localStorage.setItem('hoy', moment().format('DD/MM/YYYY'));
            localStorage.setItem('matricula', this.data.matricula);
            localStorage.setItem('vehiculo', this.data.vehiculo);
            localStorage.setItem('idVehiculo', this.data.idVehiculo);
            localStorage.setItem('telefono', this.data.telefono);
            localStorage.setItem('coordinador', 'true');
          }
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
  constructor(private httpClient: HttpClient) {
    this.headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    });
  }
}
export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthAdminService, useClass: AuthAdminService }
];
