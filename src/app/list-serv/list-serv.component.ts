import { Component, OnInit } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../servicios/sser.service';
import {HttpModule} from '@angular/http';
import {ConfirmationService} from 'primeng/api';
import { Global } from '../comun/global';


@Component({
  selector: 'app-list-serv',
  templateUrl: './list-serv.component.html',
  styleUrls: ['./list-serv.component.css'],
  providers: [SserService,ConfirmationService]
})
export class ListServComponent implements OnInit {
  @Output() cerrarSerListFechEvento = new EventEmitter();
  @Output() cerrarSerListOpenSAFechEvento = new EventEmitter();
  servicios: Servicio[];
  fecha: string;
  fechaIni: string;
  fechaFin: string;
  message: string[];
  global: Global = new Global();
 
  constructor(private sser: SserService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.fecha = moment().format('DD/MM/YYYY');
    this.actualizar(false);

  }
  abrirSA(){
    console.log("emite-->2");
    this.cerrarSerListOpenSAFechEvento.emit();
  }
  actualizar(periodo:boolean) {
    if(periodo){
      const ser ={'fechaIni': this.fechaIni,'fechaFin': this.fechaFin, 'idConductor':localStorage.getItem('idConductor')};
      this.sser.getSerFech(JSON.stringify(ser)).subscribe(result => {
        this.servicios = result;
      });

    }else{
      const fech = moment(this.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const ser ={'fechaIni': fech,'fechaFin': fech, 'idConductor':localStorage.getItem('idConductor')};
      this.sser.getSerFech(JSON.stringify(ser)).subscribe(result => {
        this.servicios = result;
      });
    }
  }
  actualizaConFechaAyer(){
    this.fecha = moment().subtract(1, 'days').format('DD/MM/YYYY');
    this.actualizar(false);
  }
  actualizaConFechaHoy() {
    this.fecha = moment().format('DD/MM/YYYY');
    this.actualizar(false);
  }
  actualizaConFechaManana() {
    this.fecha = moment().add(1, 'days').format('DD/MM/YYYY');
    this.actualizar(false);
  }
  actualizaConMes(){
    this.fechaIni = moment().startOf('month').format('YYYY-MM-DD');
    this.fechaFin = moment().endOf('month').format('YYYY-MM-DD');
    this.actualizar(true);
  }
  actualizaConMesAnterior(){
    this.fechaIni = moment().startOf('month').subtract(1,'month').format('YYYY-MM-DD');
    this.fechaFin = moment().endOf('month').subtract(1,'month').format('YYYY-MM-DD');
    this.actualizar(true);
  }
  actualizaConMesProx(){
    this.fechaIni = moment().startOf('month').add(1,'month').format('YYYY-MM-DD');
    this.fechaFin = moment().endOf('month').add(1,'month').format('YYYY-MM-DD');
    this.actualizar(true);
  }
  actualizarLista() {
    this.ngOnInit();
  }
  actualizarConEspera(){
    setTimeout(function() {
      this.actualizar(false);
    }.bind(this), 2500);
       
  }
  actualizaConFechaSemana(){
    this.fechaIni = moment().startOf('isoWeek').format('YYYY-MM-DD');
    this.fechaFin = moment().startOf('isoWeek').add(6, 'days').format('YYYY-MM-DD');
    this.actualizar(true);
  }

 
}
