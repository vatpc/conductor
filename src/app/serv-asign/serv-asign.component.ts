import { Component, OnInit } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../servicios/sser.service';
import { SmailService } from '../servicios/smail.service';
import {HttpModule} from '@angular/http';
import { Notificaciones } from '../comun/notificaciones';
import { Cliente } from '../comun/cliente';
import { Global } from '../comun/global';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-serv-asign',
  templateUrl: './serv-asign.component.html',
  styleUrls: ['./serv-asign.component.css'],
  providers: [SserService, SmailService,ConfirmationService]
})
export class ServAsignComponent implements OnInit {
  servicios: Servicio[];
  message: string[];
  sortOrder: number;
  sortOptions: any[];
  sortKey:any;
  sortField: string;
  notificaciones:Notificaciones;
  cliente:Cliente;
  global:Global= new Global();

  constructor(private sser: SserService, private smail: SmailService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.notificaciones = new Notificaciones(this.smail);
    this.actualizar();
    this.sortOptions = [
      { label: 'fecha mas reciente', value: '!FechaDeRecogida' },
      { label: 'fecha mas antiguo', value: 'FechaDeRecogida' },
      { label: 'Estado', value: 'estado' }
    ];
  }
  actualizar() {
    const ser ={'idConductor':localStorage.getItem('idConductor')};
    this.sser.getSerAct(JSON.stringify(ser)).subscribe(result => {
      this.servicios = result;
    });
  }
  fech2time(fechaDeRecogida: string): string {
    return moment(fechaDeRecogida).format('HH:mm:ss');
  }
  actualizarLista() {
    this.ngOnInit();
  }
  actualizarConEspera(){
    setTimeout(function() {
      this.actualizar();
    }.bind(this), 2500);
       
  }
  onSortChange(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  replacer(key,value){
    if (value === null) {
      return undefined;} 
    else{
      return value;
    }
  }
  aceptarSer(servicio:Servicio){
    const ser= {'estado':servicio.estado};
    this.sser.getSerNextEstado(JSON.stringify(ser)).subscribe(result => {
      var nuevoSer = JSON.parse(JSON.stringify( servicio, this.replacer));
      for(const res of result){
        //console.log('estado--->>>'+JSON.stringify(res));
        nuevoSer.estado= res.nombre;
        this.sser.setServicio(nuevoSer).subscribe();
      }
      this.notCliente(nuevoSer,true);
      this.actualizarConEspera();
    });
  }
  notCliente(servicio:Servicio,acepto:boolean){
    if(acepto){
      const cliente={'idCliente': servicio.idCliente};
      this.sser.getCliente(JSON.stringify(cliente)).subscribe(result => {
        for(const res of result){
          if(res && res.recibirNot=='1') this.notificaciones.sendReservadoMail(res.email, servicio);
        }
      });
    }else{
      this.notificaciones.sendNoAceptadoMail(localStorage.getItem('nombre'), servicio);
    }
  }

  rechazarSer(event:any, servicio:Servicio){
    this.notCliente(servicio,false);
    servicio.estado = this.global.ESTADO_EN_PETICION;
    servicio = JSON.parse(JSON.stringify(servicio, this.replacer));
    this.sser.setServicio(servicio).subscribe();
    this.actualizarConEspera();
  }
  proponer(event:any,servicio:Servicio){
    //console.log(':::::::::::::::::::::::::::>>>>');
    this.confirmationService.confirm({
      message: 'Va a proponer su candidatura al servicio ¿Esta seguro?',
      accept: () => {
        this.aceptarSer(servicio);
      }
   });
  }
}
