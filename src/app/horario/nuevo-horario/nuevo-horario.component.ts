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

@Component({
  selector: 'app-nuevo-horario',
  templateUrl: './nuevo-horario.component.html',
  styleUrls: ['./nuevo-horario.component.css'],
  providers: [SserService]
})
export class NuevoHorarioComponent implements OnInit {
  horarioNuevo: Horarios;
  acontecimientos: Acontecimiento[];
  message: string;
  @Output() cerrarNHEvento = new EventEmitter();

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

    var hn = JSON.parse(JSON.stringify( this.horarioNuevo, this.replacer));

    const now = moment().format('YYYY-MM-DD');
    const ini = moment(this.horarioNuevo.fechaIni, ['YYYY-MM-DD HH:mm','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD');
    const fin = moment(this.horarioNuevo.fechaFin, ['YYYY-MM-DD HH:mm','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD');


    if ((moment(ini).toDate().getTime() >= moment(now).toDate().getTime()) 
       && (moment(fin).toDate().getTime() >= moment(ini).toDate().getTime())) {
        
      hn.visible = false;
      hn.fechaIni = ini;
      hn.fechaFin = fin;

      hn.horaIni = moment(hn.horaIni, ['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('HH:mm');
      hn.horaFin = moment(hn.horaFin, ['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('HH:mm');

      /* console.log("hn.horaIni="+hn.horaIni);
      console.log("hn.horaFin="+hn.horaFin); */

      this.sser.setHorario(hn).subscribe();
      this.cerrarNHEvento.emit();

    }else {
      this.message = '¡¡Atencion, solo pude añadir una eventualidad a futuro, correcta!!';
        setTimeout(function() {
          this.message = null;
        }.bind(this), 2500);
    }
  }
  replacer(key,value){
    if (value === null) {
      return undefined;} 
    else{
      return value;
    }
  }
}
