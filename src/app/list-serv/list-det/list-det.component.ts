import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../comun/servicio';
import { Conductor } from '../../comun/conductor';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../../servicios/sser.service';
import { HttpModule } from '@angular/http';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmationService } from 'primeng/api';
import { Global } from '../../comun/global';

@Component({
  selector: 'app-list-det',
  templateUrl: './list-det.component.html',
  styleUrls: ['./list-det.component.css'],
  providers: [ConfirmationService]
})
export class ListDetComponent implements OnInit {
  @Input() servicios: Servicio[];
  @Output() cerrarListSerFechEvento = new EventEmitter();
  @Output() cerrarListSerOpenSAFechEvento = new EventEmitter();
  displayDialog: boolean;
  selectedSer: Servicio;
  sortOptions: any[];
  sortField: string;
  sortOrder: number;
  showEdit: boolean;
  global: Global = new Global();
  sortKey: any;
  bloq: boolean = false;
  constructor(private sser: SserService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.showEdit = false;
    this.sortOptions = [
      { label: 'fecha mas reciente', value: '!FechaDeRecogida' },
      { label: 'fecha mas antiguo', value: 'FechaDeRecogida' },
      { label: 'Estado', value: 'estado' }
    ];
  }
  ponerActual(servicio:Servicio){
    console.log("emite-->1");
    localStorage.setItem('servicioActual',servicio.idservicio);
    this.cerrarListSerOpenSAFechEvento.emit();
  }
  selectSer(event: Event, ser: Servicio) {
    this.selectedSer = ser;
    this.displayDialog = true;
    event.preventDefault();
  }
  onDialogHide() {
    this.selectedSer = null;
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
  fech2time(fechaDeRecogida: string): string {
    return moment(fechaDeRecogida).format('DD/MM HH:mm:ss');
  }
  actualizar() {
    this.cerrarListSerFechEvento.emit();
  }
  incidencia(servicio: Servicio) {
    if(!servicio.visible2){
    this.confirmationService.confirm({
      message: 'Va a liberar el servicio por una incidencia ¿Esta seguro?',
      accept: () => {
        servicio.estado = this.global.ESTADO_EN_PETICION;
        servicio.comentarioCon = '¡¡ EL CONDUCTOR ' + servicio.Conductor + ' (' + servicio.idConductor + ')' + ' HA NOTIFICADO UNA INCIDENCIA!!  ';
        servicio = this.renovarHoraDerecogida(servicio);
        var nuevoSer = JSON.parse(JSON.stringify(servicio, this.replacer));
        this.sser.setServicio(nuevoSer).subscribe();
        //this.cerrarSHEvento.emit();
        this.actualizar();
      }
    });
  }
  }
  cerrarVentana(servicio: Servicio){
    servicio.visible2=false;
    this.actualizar();
  }
  cerrar(servicio: Servicio) {
    this.bloq=!this.bloq; 
    servicio.visible2 = !servicio.visible2;
   /* // this.ok = false;
    this.confirmationService.confirm({
      message: 'Va a Cerrar el servicio ded forma manual ¿Esta seguro?',
      accept: () => {
        //this.ok = true;
      }
    }); */
  }
  replacer(key, value) {
    if (value === null) {
      return undefined;
    }
    else {
      return value;
    }
  }
  renovarHoraDerecogida(servicio: Servicio): Servicio {
    let t0 = moment(servicio.FechaDeRecogida).toDate().getTime();
    let t1 = moment().toDate().getTime();
    if (t1 > t0) {
      servicio.comentarioCon += 'Fecha de recogida anterior::' + servicio.FechaDeRecogida;
      servicio.FechaDeRecogida = moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
    }
    return servicio;
  }
}
