import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Sesion } from '../comun/sesion';
import { Tkn } from '../comun/tkn';
//import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Empresas } from '../comun/empresas';

import { Global } from '../comun/global';


@Injectable()
export class SempresasService {

  headers = new Headers();
 // options: RequestOptions;
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
  // Servicios para empresas----------------------------------------------------------------------------------------------
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getEmpresa(idEmpresa: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/empresasS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)) +
                '&empresa=' + idEmpresa);

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/empresasS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)) +
                '&empresa=' + idEmpresa);
  }
}