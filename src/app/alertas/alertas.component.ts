import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../servicios/sser.service';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { Servicio } from '../comun/servicio';
import { Notificaciones } from '../comun/notificaciones';
import { SmailService } from '../servicios/smail.service';
import { Message } from 'primeng/api';
import { Global } from '../comun/global';
import { Alertas } from '../comun/alertas';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css'],
  providers: [SserService]
})
export class AlertasComponent implements OnInit {

  alertas: Alertas[];
  visible: boolean = false;
  intervalId :any;
  @Output() cerrarAleEvento = new EventEmitter();
  sortOptions: any[];
  sortField: string;
  sortOrder: number;
  sortKey:any;
  onSortChange:any;
  global: Global = new Global();

  constructor(private sser: SserService) {}

  ngOnInit() {
    var email = localStorage.getItem('username');
    this.getAlertas(email);
    this.sortOptions = [
      { label: 'fecha mas reciente', value: '!fechaAlta' },
      { label: 'fecha mas antiguo', value: 'fechaAlta' },
      { label: 'Estado', value: 'estado' }
    ];
    this.sortOrder = -1;
    this.sortField = "fechaAlta";
  }
  getAlertas(email:string) {
    const config = JSON.stringify({ 'tabla': 'alertas', 'conEstado': '0' });

    if(email==this.global.USER_ADMIN){
      email = localStorage.getItem('condSupl');
    }

    const filtro = JSON.stringify({ 'filtro': 'para', 'valor': email, 'traza': '0' });
    const filtro1 = JSON.stringify({ 'filtro1': 'estado', 'valor1': 'Activo',"operator1":"AND"});
    const filtro2 = JSON.stringify({ 'filtro2': 'para', 'valor2': 'Todos',"operator2":"OR"});

    this.sser.lista(config, null, filtro,filtro1,filtro2).subscribe(result => {
      this.alertas = result;
    });
  }
  inactivarAlerta(alerta:Alertas){
    alerta.estado="Inactiva";

    const config = JSON.stringify({ 'tabla': 'alertas', 'id': alerta.id });

    this.sser.actualizaConBorrado(config).subscribe(result => {
      console.log(JSON.stringify(result));
      this.ngOnInit();
    });
  }
}
