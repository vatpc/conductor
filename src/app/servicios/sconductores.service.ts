import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Sesion } from '../comun/sesion';
import { Tkn } from '../comun/tkn';
//import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { CompaniaPeticion } from '../comun/compania-peticion';
import { Global } from '../comun/global';
import { Conductor } from '../comun/conductor';
import { ConductorPeticion } from '../comun/conductor-peticion';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class SconductoresService {
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
  // Servicios para conductores----------------------------------------------------------------------------------------------
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getConductores(conductor: ConductorPeticion): Observable<any> {
    if (conductor) {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + (JSON.stringify(this.tkn))
        + ('&conductor=') + (JSON.stringify(conductor)));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + ('&conductor=') + encodeURIComponent(JSON.stringify(conductor)));
    } else {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Servicios para compañias----------------------------------------------------------------------------------------------
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCompanias(compania: CompaniaPeticion): Observable<any> {
    if (compania) {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/companiaS.php?tkn=' + (JSON.stringify(this.tkn))
        + ('&compania=') + JSON.stringify(compania));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/companiaS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + ('&compania=') + encodeURIComponent(JSON.stringify(compania)));
    } else {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/companiaS.php?tkn=' + (JSON.stringify(this.tkn)));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/companiaS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));
    }
  }
  getVehiculos(vehiculo: string): Observable<any> {
    if (vehiculo == null) {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/vehiculoS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/vehiculoS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));

    } else {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/vehiculoS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + ('&vehiculo=') + (vehiculo));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/vehiculoS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + ('&vehiculo=') + encodeURIComponent((vehiculo)));
    }
  }
 
}

