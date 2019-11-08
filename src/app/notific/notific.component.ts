import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import {Calendar} from 'fullcalendar';
import {ScheduleModule} from 'primeng/primeng';
import { SserService } from '../servicios/sser.service';
import { Servicio } from '../comun/servicio';
import { Horarios } from '../comun/horarios';
import { Evento } from '../comun/evento';
import { Global } from '../comun/global';
import * as moment from 'moment';
import { Conductor } from '../comun/conductor';

@Component({
  selector: 'app-notific',
  templateUrl: './notific.component.html',
  styleUrls: ['./notific.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [SserService]
})
export class NotificComponent implements OnInit {

  global:Global= new Global();
  
  events: any[];
  evento: Evento;
  eventos: Evento[] = [];
  headerConfig: any;
  optionscfg: any;
  servicios: Servicio[];
  servicio: Servicio;
  horarios: Horarios[];
  conductores: Conductor[]=[];



  constructor(private sser: SserService) {
    this.getConductores();
  }
  getConductores(){
    this.sser.getConductores(null).subscribe(result => {
      this.conductores=result;
      this.getServicios();
      this.getExenciones();
    });
  }
  generaColorExencion(estado:string):string{
    var color = '#000000';
    if(estado && estado=="Avería"){
      color="#fdf300";
    } 
    if(estado && estado=="Enfermedad") {
      color="#6662ff";
    }
    if(estado && estado=="Servicio Privado") {
      color="#fc1cc6";
    }
    if(estado && estado=="Vacaciones") {
      color="#00e4fd";
    }
    return color;
  }
  generaColor(estado:string):string{
    var color = '#000000';
    if(estado && estado==this.global.ESTADO_EN_PETICION){
      color="#06052f";
    } 
    if(estado && estado==this.global.ESTADO_ASIGNADO) {
      color="#900C3F";
    }
    if(estado && estado==this.global.ESTADO_EN_CAMINO) {
      color="#3d1c0a";
    }
    if(estado && estado==this.global.ESTADO_FINALIZADO) {
      color="#3f9f40";
    }
    if(estado && estado==this.global.ESTADO_ANULADO) {
      color="#ff3f3f";
    }
    if(estado && estado==this.global.ESTADO_ADMINISTRANDO) {
      color="#ffbc3f";
    }
    if(estado && estado==this.global.ESTADO_EN_RUTA) {
      color="#0a3909";
    }
    if(estado && estado==this.global.ESTADO_RESERVADO) {
      color="#6ba5c1";
    }
    if(estado && estado==this.global.ESTADO_EN_POSICION) {
      color="#ff00fc";
    }
    return color;
  }
  getCond(id:string){
    for(let c of this.conductores){
      if(c.id==id) return c.nombre;
    }
  }
  getServicios(): void {
    let coor = localStorage.getItem('coordinador');
    if(coor && coor =='true'){
      this.eventos = [];
      const fechaFin=moment().add(1,'month').format('YYYY-MM-DD');
      const fechaIni=moment().subtract(1,'month').format('YYYY-MM-DD');

      const datos ={'fechaIni': fechaIni,'fechaFin': fechaFin, 'idCompania':localStorage.getItem('idCompania')};
      this.sser.getServicios(JSON.stringify(datos)).subscribe(result => {
        this.servicios = result;

          for ( const servicio of this.servicios){
              this.evento = {

                  'title' : '('+servicio.idservicio+') --'+this.getCond(servicio.idConductor)+'--'+this.fech2time(servicio.FechaDeRecogida)+'\n'
                            +servicio.Origen+'\t--'+servicio.Destino,
                  'start' :  moment(servicio.FechaDeRecogida).subtract(servicio.tiempoMedioRecogida, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
                  'end' :   moment(servicio.FechaDeRecogida).add(servicio.tiempoMedioServicio, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
                  'color' : this.generaColor(servicio.estado),
                  'textColor':'white'
              };
              // console.log( "1>>>>>>>" + JSON.stringify(this.evento));
              this.eventos.push(this.evento);
          }
      });
    }else{
      this.eventos = [];
      const fechaFin=moment().add(1,'month').format('YYYY-MM-DD');
      const fechaIni=moment().subtract(1,'month').format('YYYY-MM-DD');
      const datos ={'fechaIni': fechaIni,'fechaFin': fechaFin, 'idConductor':localStorage.getItem('idConductor')};
      this.sser.getServicios(JSON.stringify(datos)).subscribe(result => {
        this.servicios = result;
        // console.log('Consulta servicios ---->>>>>>' + JSON.stringify(result.json())); // JSON.stringify(this.servicios));
          for ( const servicio of this.servicios){
              this.evento = {

                  'title' : '('+servicio.idservicio+') --'+this.fech2time(servicio.FechaDeRecogida)+'\n'
                            +servicio.Origen+'\n' 
                            +servicio.Destino,//+''+ "\n" + servicio.Origen + "\n" + servicio.Destino,
                  'start' :  moment(servicio.FechaDeRecogida).subtract(servicio.tiempoMedioRecogida, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
                  'end' :   moment(servicio.FechaDeRecogida).add(servicio.tiempoMedioServicio, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
                  'color' : this.generaColor(servicio.estado),
                  'textColor':'white'
              };
              // console.log( "1>>>>>>>" + JSON.stringify(this.evento));
              this.eventos.push(this.evento);
          }
      });
    }
  }

  getExenciones(): void {
    let coor = localStorage.getItem('coordinador');
    if(coor && coor =='true'){

      this.eventos = [];
      const fechaFin=moment().add(1,'month').format('YYYY-MM-DD');
      const fechaIni=moment().subtract(1,'month').format('YYYY-MM-DD');
      const datos ={'fechaIni': fechaIni,'fechaFin': fechaFin, 'idCompania':localStorage.getItem('idCompania')};
      this.sser.getExenciones(JSON.stringify(datos)).subscribe(result => {
        this.horarios = result;

          for ( const horario of this.horarios){
              this.evento = {

                  'title' : '('+horario.id+') --'+horario.descripcionEventualidad,//+''+ "\n" + servicio.Origen + "\n" + servicio.Destino,
                  'start' :  moment(horario.fechaIni+' '+horario.horaIni).format('YYYY-MM-DDTHH:mm:ss'),
                  'end' :   moment(horario.fechaFin+' '+horario.horaFin).format('YYYY-MM-DDTHH:mm:ss'),
                  'color' : 'black',
                  'textColor':this.generaColorExencion(horario.descripcionEventualidad)
              };
              console.log( "1>>>>>>>" + JSON.stringify(this.evento));
              this.eventos.push(this.evento);
          }
      });


    }else{
      this.eventos = [];
      const fechaFin=moment().add(1,'month').format('YYYY-MM-DD');
      const fechaIni=moment().subtract(1,'month').format('YYYY-MM-DD');
      const datos ={'fechaIni': fechaIni,'fechaFin': fechaFin, 'idConductor':localStorage.getItem('idConductor')};
      this.sser.getExenciones(JSON.stringify(datos)).subscribe(result => {
        this.horarios = result;
        // console.log('Consulta servicios ---->>>>>>' + JSON.stringify(result.json())); // JSON.stringify(this.servicios));
          for ( const horario of this.horarios){
              this.evento = {

                  'title' : '('+horario.id+') --'+horario.descripcionEventualidad,//+''+ "\n" + servicio.Origen + "\n" + servicio.Destino,
                  'start' :  moment(horario.fechaIni+' '+horario.horaIni).format('YYYY-MM-DDTHH:mm:ss'),
                  'end' :   moment(horario.fechaFin+' '+horario.horaFin).format('YYYY-MM-DDTHH:mm:ss'),
                  'color' : 'black',
                  'textColor':this.generaColorExencion(horario.descripcionEventualidad)
              };
              console.log( "1>>>>>>>" + JSON.stringify(this.evento));
              this.eventos.push(this.evento);
          }
      });
    }

  }

  fech2time(fechaDeRecogida: string): string {
    return moment(fechaDeRecogida).format('HH:mm');
  }

  // Lista controlada por conductor
  actualizaLista() {
      this.getServicios();
  }

  ngOnInit() {

    this.optionscfg = {
        locale: 'es',
        editable: false,
        nowIndicator: true,
        weekNumbers: false,
        defaultView: 'agendaDay',
        slotEventOverlap: false,
        intervalEnd: '00:30:00',
        columnHeader: true,
        slotDuration:'00:30:00',
        allDaySlot: false,
        scrollTime:'08:00:00',
        navLinks:true
    };

    this.headerConfig = {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaDay,agendaWeek,timelineDay,listMonth'
    };
  }

}
