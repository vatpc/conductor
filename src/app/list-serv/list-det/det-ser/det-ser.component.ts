import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Servicio } from '../../../comun/servicio';
import { Conductor } from '../../../comun/conductor';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../../../servicios/sser.service';
import {HttpModule} from '@angular/http';
import {DataViewModule} from 'primeng/dataview';
import {ConfirmationService} from 'primeng/api';
import { Global } from '../../../comun/global';

@Component({
  selector: 'app-det-ser',
  templateUrl: './det-ser.component.html',
  styleUrls: ['./det-ser.component.css'],
  providers: [SserService,ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class DetSerComponent implements OnInit {
  @Input() servicio: Servicio;
  @Output() cerrarDetSerEvento = new EventEmitter();
  global: Global = new Global();
  tiempoInicioRuta:string;
  tiempoFinRuta:string;
  tiempoDeEspera:string;

  constructor(private sser: SserService, private confirmationService1: ConfirmationService) { }

  ngOnInit() {
    if(this.servicio.tiempoInicioRuta) this.tiempoInicioRuta = moment(this.servicio.tiempoInicioRuta,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY HH:mm');
    if(this.servicio.tiempoFinRuta) this.tiempoFinRuta = moment(this.servicio.tiempoFinRuta,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY HH:mm');
  }
  finalizar(){
    this.confirmationService1.confirm({
      message: 'Va a guardar el servicio manualmente ¿Esta seguro?',
      accept: () => {
        var nuevoSer = JSON.parse(JSON.stringify(this.servicio, this.replacer));
        nuevoSer.estado = this.global.ESTADO_FINALIZADO;

        if (this.tiempoDeEspera && +this.tiempoDeEspera>0) nuevoSer.parada='1';
        else nuevoSer.parada='0'

        nuevoSer.tiempoDeEspera = this.tiempoDeEspera;
        nuevoSer.tiempoInicioRuta = moment(this.tiempoInicioRuta,['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD HH:mm:ss');
        nuevoSer.tiempoFinRuta = moment(this.tiempoFinRuta,['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD HH:mm:ss');

        nuevoSer.visible2=null;

        nuevoSer = JSON.parse(JSON.stringify(nuevoSer, this.replacer));
      
        this.sser.setServicio(nuevoSer).subscribe();

        this.cerrarDetSerEvento.emit();
      }
    });
  }
  replacer(key, value) {
    if (value === null) {
      return undefined;
    }
    else {
      return value;
    }
  }
}
