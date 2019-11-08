import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Sesion } from '../comun/sesion';
import { Tkn } from '../comun/tkn';
// import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Observable';
import { DataScroller } from 'primeng/primeng';
import { Global } from '../comun/global';
import { Servicio } from '../comun/servicio';
import { Horarios } from '../comun/horarios';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ServiceWorkerModule} from '@angular/service-worker';
import { SwPush, SwUpdate } from "@angular/service-worker";
/* import {webpush} from "web-push"; */


@Injectable()
export class SserService {
  headers = new Headers();
  //options: RequestOptions;
  sesion: Sesion = new Sesion();
  data: any;
  tkn: Tkn;
  sub: any;

  global: Global = new Global();
  carpeta: string = '/std/';

  constructor(private httpClient: HttpClient,private swPush: SwPush) {
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
  // Servicios por fecha----------------------------------------------------------------------------------------------
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getSerActCon(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serActCondS1.php?tkn=' + (JSON.stringify(this.tkn))
      + '&ser=' + datos);

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serActCondS1.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&ser=' + encodeURIComponent(datos));
  }
  getSerNextEstado(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serNextEstadoS.php?tkn=' + (JSON.stringify(this.tkn))
      + '&ser=' + datos);

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serNextEstadoS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&ser=' + encodeURIComponent(datos));
  }
  getSerPrevEstado(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serPrevEstadoS.php?tkn=' + (JSON.stringify(this.tkn))
      + '&ser=' + datos);

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serPrevEstadoS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&ser=' + encodeURIComponent(datos));
  }
  setServicio(servicio: Servicio): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serU.php?tkn=' + (JSON.stringify(this.tkn))
      + '&servicio=' + ((JSON.stringify(servicio))));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serU.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&servicio=' + encodeURIComponent(JSON.stringify(servicio)));
  }
  setServicioU(servicio: Servicio): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serUU.php?tkn=' + (JSON.stringify(this.tkn))
      + '&servicio=' + ((JSON.stringify(servicio))));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serUU.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&servicio=' + encodeURIComponent(JSON.stringify(servicio)));
  }
  getSerFech(ser: string): Observable<any> {

    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerCond.php?tkn=' + (JSON.stringify(this.tkn))
      + '&ser=' + (ser));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerCond.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&ser=' + encodeURIComponent(ser));

  }
  getAcontecimientos(): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/acontecimientosS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/acontecimientosS.php?tkn='
      + encodeURIComponent(JSON.stringify(this.tkn)));
  }
  setHorario(horario: Horarios): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/horariosI.php?tkn=' + (JSON.stringify(this.tkn))
      + '&horario=' + (JSON.stringify(horario)));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/horariosI.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&horario=' + encodeURIComponent(JSON.stringify(horario)));
  }
  borrarHorario(horario: Horarios): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/horariosD.php?tkn=' + (JSON.stringify(this.tkn))
      + '&horario=' + (JSON.stringify(horario)));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/horariosD.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&horario=' + encodeURIComponent(JSON.stringify(horario)));
  }

  getSerFactComp(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/ultimaFechFactCond.php?tkn=' + (JSON.stringify(this.tkn))
      + '&ser=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/ultimaFechFactCond.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&ser=' + encodeURIComponent(datos));
  }
  getCondFact(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantFacturacion/condFechFacS.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantFacturacion/condFechFacS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + datos);
  }
  getSerAct(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerAct.php?tkn=' + (JSON.stringify(this.tkn))
      + '&ser=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerAct.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&ser=' + encodeURIComponent(datos));
  }
  getCliente(cliente: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/clientesS_id.php?tkn=' + (JSON.stringify(this.tkn))
      + '&cliente=' + cliente);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/clientesS_id.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&cliente=' + encodeURIComponent(cliente));

  }
  getServicios(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantServicios/serviciosS_pla.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantServicios/serviciosS_pla.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

  }

  getServicio(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serS.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/serS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

  }


  getExenciones(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/horariosS_pla.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantEmpresas/horariosS_pla.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

  }
  getPropietario(): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/propietarioS.php?tkn=' + (JSON.stringify(this.tkn)));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/propietarioS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));
  }
  getPropietarioTkn(tkn: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/propietarioS.php?tkn=' + ("{\"tkn\":\"" + tkn + "\"}"));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/propietarioS.php?tkn=' + encodeURIComponent(("{\"tkn\":\"" + tkn + "\"}")));
  }
  getServiciosUrg(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerUrg.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerUrg.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  getCondFromCat(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/CondFromCatS.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/CondFromCatS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  getServiciosAnl(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerAnl.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/ser/listSerAnl.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

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
  setVeh2Cond(conductor: string): Observable<any> {

    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorU.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&conductor=') + (conductor));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorU.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&conductor=') + encodeURIComponent((conductor)));
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  lista(config: string, datos: string, filtro: string, filtro1: string, filtro2: string): Observable<any> {
    this.tkn.tkn = localStorage.getItem('tkn');
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'listar.php?tkn=' + (JSON.stringify(this.tkn))
      + (config ? '&config=' + config : '')
      + (datos ? '&datos=' + datos : '')
      + (filtro ? '&filtro=' + filtro : '')
      + (filtro1 ? '&filtro1=' + filtro1 : '')
      + (filtro2 ? '&filtro2=' + filtro2 : ''));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'listar.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + (config ? '&config=' + encodeURIComponent(config) : '')
      + (datos ? '&datos=' + encodeURIComponent(datos) : '')
      + (filtro ? '&filtro=' + encodeURIComponent(filtro) : '')
      + (filtro1 ? '&filtro1=' + encodeURIComponent(filtro1) : '')
      + (filtro2 ? '&filtro2=' + encodeURIComponent(filtro2) : ''));



  }
  nuevo(config: string, datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'nuevo.php?tkn=' + (JSON.stringify(this.tkn))
      + '&config=' + config + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'nuevo.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&config=' + encodeURIComponent(config) + '&datos=' + encodeURIComponent(datos));

  }


  actualiza(config: string, datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'update.php?tkn=' + (JSON.stringify(this.tkn))
      + (config ? '&config=' + (config) : '')
      + (datos ? '&datos=' + (datos) : ''));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'update.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + (config ? '&config=' + encodeURIComponent(config) : '')
      + (datos ? '&datos=' + encodeURIComponent(datos) : ''));

  }
  actualizaConBorrado(config: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'updateConBorrado.php?tkn=' + (JSON.stringify(this.tkn))
      + (config ? '&config=' + (config) : ''));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'updateConBorrado.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + (config ? '&config=' + encodeURIComponent(config) : ''));

  }

  borra(config: string, datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'borrar.php?tkn=' + (JSON.stringify(this.tkn))
      + '&config=' + config + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'borrar.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&config=' + encodeURIComponent(config) + '&datos=' + encodeURIComponent(datos));

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getMailsCondCli(datos: string): Observable<any> {

    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/condCliMailSesion.php?tkn=' + (JSON.stringify(this.tkn))
      + '&datos=' + datos);


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/condCliMailSesion.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + '&datos=' + encodeURIComponent(datos));

  }
  getNewConductorSS(conductor: string): Observable<any> {
    const filtro = JSON.stringify({ 'tkn': this.tkn.tkn, 'conductor': conductor, 'traza': '0' });
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCondAdmSS.php?sesion=' + encodeURIComponent(filtro));
    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/sesionCondAdmSS.php?sesion='
      + encodeURIComponent(filtro));
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setPosicion(datos: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'setPos.php?tkn=' + (JSON.stringify(this.tkn))
      + (datos ? '&datos=' + (datos) : ''));


    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + this.carpeta + 'setPos.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + (datos ? '&datos=' + encodeURIComponent(datos) : ''));

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  envioFoto(fileToUpload: File, dirB: string): Observable<any> {



    const formData = new FormData();
    formData.append('fichero', fileToUpload, fileToUpload.name);

    var re = /\s/g;
    let ext = fileToUpload.name;
    let e = ext.split('.');
    ext = e[(e.length - 1)];

    var name = this.global.COND_LOG_NAME + '.' + ext;

    var subdir = this.global.DIRBASE_IMG_COND;

    const endpoint = this.global.SERVIDOR_URL_IMG;

    console.log(endpoint);

    formData.append('tkn', this.tkn.tkn);
    formData.append('name', name);
    formData.append('dirB', dirB);
    formData.append('dirS', subdir);

    return this.httpClient.post(endpoint, formData);//,{headers:httpHeaders}

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Servicios para conductores----------------------------------------------------------------------------------------------
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getConductores(conductor: string): Observable<any> {
    if (conductor) {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + (JSON.stringify(this.tkn))
        + ('&conductor=') + ((conductor)));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
        + ('&conductor=') + encodeURIComponent((conductor)));
    } else {
      console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));

      return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorS.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn)));
    }
  }
  setConductor(conductor: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorI.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&conductor=') + encodeURIComponent(conductor));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorI.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&conductor=') + encodeURIComponent(conductor));
  }
  upConductor(conductor: string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorU.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&conductor=') + (conductor));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/conductorU.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&conductor=') + encodeURIComponent(conductor));
  }
  ///////////////////////////////////////////////////////////////////
  addPushSubscriber(id: any ,subId: any) {
    this.tkn = new Tkn();
    this.tkn.tkn = localStorage.getItem('tkn');
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/subCondI.php?tkn=' + (JSON.stringify(this.tkn))
      + ('&subId=') + (subId)+ ('&Id=') + encodeURIComponent(id));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantSesion/subCondI.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&subId=') + encodeURIComponent(subId)+ ('&Id=') + encodeURIComponent(id));
  }
  getPushSubscriber(){
    return this.sub;
  }
  ///////////////////////////////////////////////////////////////////
  sendPush(datos:string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/s_comun/push.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
    + ('&datos=') + (datos));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/s_comun/push.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&datos=') + encodeURIComponent(datos));
  }
   ///////////////////////////////////////////////////////////////////
   getPosAct(datos:string): Observable<any> {
    console.log(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/getPosAct.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
    + ('&datos=') + (datos));

    return this.httpClient.get(this.global.SERVIDOR_URL + this.global.CON_SCRIPTS + '/mantConductor/getPosAct.php?tkn=' + encodeURIComponent(JSON.stringify(this.tkn))
      + ('&datos=') + encodeURIComponent(datos));
  }
}