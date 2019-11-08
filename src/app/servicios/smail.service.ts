import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Sesion } from '../comun/sesion';
import { Tkn } from '../comun/tkn';
//import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { Global } from '../comun/global';
import { Servicio } from '../comun/servicio';
import { Horarios } from '../comun/horarios';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable()
export class SmailService {
  headers = new Headers();

  sesion: Sesion = new Sesion();
  data: any;
  tkn: Tkn;

  global: Global = new Global();
  constructor(private httpClient: HttpClient) {
    this.headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    });
    //this.options = new RequestOptions({ headers: this.headers });
    this.tkn = new Tkn();
    // objeto tkn
    this.tkn.tkn = localStorage.getItem('tkn');
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Servicios Mail----------------------------------------------------------------------------------------------
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  sendEmail(datos:string): Observable<any>{
   
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/s_comun/mail.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + '&datos=' + datos);
  
  
      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/s_comun/mail.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + '&datos=' + encodeURIComponent(datos));
  }
  getPropietario(): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/propietarioS.php?tkn=' + (JSON.stringify(this.tkn)));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/propietarioS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));
  }


}

