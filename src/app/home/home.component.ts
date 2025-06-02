import { Component, ViewEncapsulation } from '@angular/core';
import { Tkn } from '../comun/tkn';
import { OnInit, OnDestroy } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';
import { AuthService } from '../servicios/auth.service';
import 'rxjs/add/operator/map';
import { Global } from '../comun/global';
import { SserService } from '../servicios/sser.service';
import * as moment from 'moment';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UsuariosService, AuthService, SserService]
})
export class HomeComponent implements OnInit, OnDestroy {

  title = 'Taxi';

  unoVis: boolean;
  dosVis: boolean;
  tresVis: boolean;
  cuatroVis: boolean;
  cincoVis: boolean;
  seisVis: boolean;
  sieteVis: boolean;
  ochoVis: boolean;
  nueveVis: boolean;
  diezVis: boolean;
  urgentesVis: boolean;
  fase: any;
  intervalId: any;
  intervalId1: any;
  color: string = "green";
  colorMapa: string = "green";
  ssCondMails: any[] = [];
  mailCond: string = "";
  idCond: string = "";
  tkns: Tkn[];
  tkn: Tkn;
  user: string;
  coord: string;
  global: Global = new Global();

  // inyecto ServiciosTaxi
  constructor(private router: Router, public authService: AuthService, private usuariosService: UsuariosService,
    private sser: SserService) {

  }
  ngOnDestroy() {
    this.desactivar();
  }
  ngOnInit(): void {

    this.getTkn(localStorage.getItem('tipo'));
    this.user = localStorage.getItem('username');
    this.coord = localStorage.getItem('coord');
    this.getMailsCondCli("1", localStorage.getItem('idCompania'));

    if (this.coord) {
      this.mailCond = localStorage.getItem('username');
    }else{
       this.mailCond = this.getComp();
        console.log("mailCond---->",this.mailCond);
        this.idCond = localStorage.getItem('idConductor');
        console.log("idCond---->",this.idCond);
    }
  }
  getTkn(tipo: string) {
    this.usuariosService.getTkn(tipo).subscribe(result => {
      for (let res of result) {
        this.tkn = res;
        localStorage.setItem('tkn', this.tkn.tkn);
        this.activar();
      }
    });
  }
  logout(): boolean {
    this.authService.logout();
    return true;
  }
  getUser(): string {
    let result = '';
    if (localStorage.getItem('coord') == 'COORDINADOR') result = localStorage.getItem('usernameCoord');
    else result = this.authService.getUser();

    return result;
  }
  getComp(): string {
    return localStorage.getItem('condSupl');
  }
  activar() {
    console.log('home:: activar URGENTES ');
    this.getNotificaciones();
    this.setCurrentPosition();
    this.urgentesVis = true;
    this.intervalId = setInterval(() => this.getNotificaciones(), 1000 * this.global.TIEMPO_ESPERA_ALERTAS_SEG * 1);
    this.intervalId1 = setInterval(() => this.setCurrentPosition(), 1000 * 30);
  }
  desactivar() {
    console.log('home:: desactivar URGENTES ');
    this.urgentesVis = false;
    clearInterval(this.intervalId);
    clearInterval(this.intervalId1);

  }
  getNotificaciones() {
    this.getAlarmas();
  }
  getAlarmas() {
    var email = localStorage.getItem('username');
    const config = JSON.stringify({ 'tabla': 'alertas', 'conEstado': '0' });

    if (this.user == this.global.USER_ADMIN) {
      email = localStorage.getItem('condSupl');
    }

    const filtro = JSON.stringify({ 'filtro': 'para', 'valor': email, 'traza': '0' });
    const filtro1 = JSON.stringify({ 'filtro1': 'estado', 'valor1': 'Activo', "operator1": "AND" });
    const filtro2 = JSON.stringify({ 'filtro2': 'para', 'valor2': 'Todos', "operator2": "OR" });

    this.sser.lista(config, null, filtro, filtro1, filtro2).subscribe(result => {
      var alertas = result;
      if (alertas && alertas.length > 0) this.color = "red";
      else this.color = "green";

    });
    let idConductor = localStorage.getItem('idConductor');
    let maxMinute = "5";
    const datos = JSON.stringify({ 'idConductor': idConductor, 'maxMinute': maxMinute });

    this.sser.getPosAct(datos).subscribe(result => {
      var alertas = result;
      if (alertas && alertas.length > 0) this.colorMapa = "green";
      else this.colorMapa = "red";

    });

  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  getMailsCondCli(esCond: string, id: string) {
    var datos = '';
    if (this.coord == this.global.USER_COOR) datos = JSON.stringify({ "esCondCli": esCond, 'compania': id });
    else datos = JSON.stringify({ "esCondCli": esCond });
    this.sser.getMailsCondCli(datos).subscribe(result => {
      this.ssCondMails = result;
    });
  }
  visSerAct() {
    this.dosVis = false;
    this.unoVis = true;
  }
  actualizoConductor(selectElem: string) {

    console.log("actualizoConductor-->getNewConductorSS--> ini", selectElem);
    this.sser.getNewConductorSS(selectElem).subscribe(result => {
      console.log("actualizoConductor-->getNewConductorSS--> res", result);

      for (let res of result) {
        localStorage.setItem('condSupl', selectElem);
        localStorage.setItem('idConductor', res.idConductor);
        localStorage.setItem('nombre', res.nombre);
        localStorage.setItem('idCompania', res.idCompania);
        localStorage.setItem('email', res.email);
        localStorage.setItem('tipo', '5');
        localStorage.setItem('hoy', moment().format('DD/MM/YYYY'));
        localStorage.setItem('matricula', res.matricula);
        localStorage.setItem('vehiculo', res.vehiculo);
        localStorage.setItem('idVehiculo', res.idVehiculo);
        localStorage.setItem('telefono', res.telefono);
        localStorage.setItem('urlFoto', res.urlFoto);
        this.mailCond = res.email;

      }
      this.unoVis = false; this.dosVis = false; this.tresVis = false; this.cuatroVis = false; this.cincoVis = false; this.seisVis = false; this.sieteVis = false; this.ochoVis = false; this.nueveVis = false;
      if (this.router.url == '/recarga') this.router.navigate(['reCarga']);
      else this.router.navigate(['recarga']);
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitud = position.coords.longitude;
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let idConductor = localStorage.getItem('idConductor');

        const datos = JSON.stringify({ 'idConductor': idConductor, 'latitud': latitude, 'longitud': longitud, 'ultimaActualizacion': now });
        this.sser.setPosicion(datos).subscribe();

      });
    }
  }
}
