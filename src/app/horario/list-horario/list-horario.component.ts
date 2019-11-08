import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import {HttpModule} from '@angular/http';
import { SconductoresService } from '../../servicios/sconductores.service';
import { Acontecimiento } from '../../comun/acontecimiento';
import { Horarios } from '../../comun/horarios';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { ConfirmDialogModule } from 'primeng/primeng';
import { Console } from '@angular/core/src/console';
import { SserService } from '../../servicios/sser.service';
import { Evento } from '../../comun/evento';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-list-horario',
  templateUrl: './list-horario.component.html',
  styleUrls: ['./list-horario.component.css'],
  providers: [SserService,ConfirmationService]
})
export class ListHorarioComponent implements OnInit {

  horarioNuevo: Horarios;
  acontecimientos: Acontecimiento[];
  message: string;
  @Output() cerrarNHEvento = new EventEmitter();

  horarios: Horarios[];
  sortField:any;
  sortOrder:any;

  constructor(private sser: SserService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getExenciones();
  }
  returFechaIni(horario: Horarios){
    return moment(horario.fechaIni+' '+horario.horaIni).format('YYYY-MM-DD HH:mm:ss');
  }
  returFechaFin(horario: Horarios){
    return moment(horario.fechaFin+' '+horario.horaFin).format('YYYY-MM-DD HH:mm:ss');
  }
  getExenciones(): void {
    const fechaFin=moment().add(1,'month').format('YYYY-MM-DD');
    const fechaIni=moment().subtract(1,'month').format('YYYY-MM-DD');
    const datos ={'fechaIni': fechaIni,'fechaFin': fechaFin, 'idConductor':localStorage.getItem('idConductor')};
    this.sser.getExenciones(JSON.stringify(datos)).subscribe(result => {
      this.horarios = result;
    });

  }
  borrar(horario: Horarios){
    this.confirmationService.confirm({
      message: 'Va a borrar el horario definitivamente ¿Esta seguro?',
      accept: () => {
        console.log('borro---->'+horario.id);
        //this.cerrarSHEvento.emit()
        this.sser.borrarHorario(horario).subscribe();
        this.actualizarConEspera();
      }
    });
  }
  actualizarConEspera(){
    this.wait(1000);
    this.ngOnInit();
  }
  wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
}
