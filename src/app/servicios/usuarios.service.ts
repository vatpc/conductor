import { Injectable } from '@angular/core';
import { Sesion } from '../comun/sesion';
import { Tkn } from '../comun/tkn';
//import { Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Md5} from 'ts-md5/dist/md5';
import { Global } from '../comun/global';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable()
export class UsuariosService {

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
  getTkn(tipo: string ): Observable<any> {
    this.tkn = new Tkn();
    this.tkn.id = tipo;
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantUsuario/tknS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));
    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantUsuario/tknS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));

  }
}
