import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import {HttpModule} from '@angular/http';
import { SconductoresService } from '../servicios/sconductores.service';
import { Acontecimiento } from '../comun/acontecimiento';
import { Horarios } from '../comun/horarios';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { ConfirmDialogModule } from 'primeng/primeng';
import { Console } from '@angular/core/src/console';
import { SserService } from '../servicios/sser.service';


@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css'],
  providers: [SserService]
})
export class HorarioComponent implements OnInit {
 
  horarioNuevo: Horarios;
  acontecimientos: Acontecimiento[];
  message: string;
  @Output() cerrarResEvento = new EventEmitter();
  unoVis:any;
  dosVis:any;

  constructor(private sser: SserService) { }

  ngOnInit() {
    this.horarioNuevo = new Horarios();
    this.horarioNuevo.idConductor = localStorage.getItem('idConductor');
    this.horarioNuevo.fechaIni = moment().format('DD/MM/YYYY');
    
    this.horarioNuevo.fechaFin = moment().format('DD/MM/YYYY');
    this.horarioNuevo.horaIni = moment('2018-01-01 00:00').format('HH:mm');
    this.horarioNuevo.horaFin = moment('2018-01-01 01:00').format('HH:mm');
    this.getAcontecimientos();
  }

  getAcontecimientos() {
    this.sser.getAcontecimientos().subscribe(result => {
      this.acontecimientos = result;
    });
  }
  asignoAcont(idEventualidad: string) {
    this.horarioNuevo.idEventualidad = idEventualidad;
  }
  new() {
    const now = moment().format('YYYY-MM-DD');
    const ini = moment(this.horarioNuevo.fechaIni, ['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD');
    const fin = moment(this.horarioNuevo.fechaFin, ['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD');


    if ((moment(ini).toDate().getTime() >= moment(now).toDate().getTime()) 
       && (moment(fin).toDate().getTime() >= moment(ini).toDate().getTime())) {
        
      this.horarioNuevo.visible = false;
      this.horarioNuevo.fechaIni = ini;
      this.horarioNuevo.fechaFin = fin;

      this.horarioNuevo.horaIni = moment(this.horarioNuevo.horaIni, 'HH:mm').format('HH:mm');
      this.horarioNuevo.horaFin = moment(this.horarioNuevo.horaFin, 'HH:mm').format('HH:mm');

      this.sser.setHorario(this.horarioNuevo).subscribe();
      this.cerrarResEvento.emit();

    }else {
      this.message = '¡¡Atencion, solo pude añadir una eventualidad a futuro, correcta!!';
        setTimeout(function() {
          this.message = null;
        }.bind(this), 2500);
    }
  }
}
