import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { SserService } from '../servicios/sser.service';
import { Servicio } from '../comun/servicio';
import { Notificaciones } from '../comun/notificaciones';
import { Propietario } from '../comun/propietario';
import { SmailService } from '../servicios/smail.service';
import { Global } from '../comun/global';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-serv-act',
  templateUrl: './serv-act.component.html',
  styleUrls: ['./serv-act.component.css'],
  providers: [SserService, SmailService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class ServActComponent implements OnInit {

  // @Input() servicio: Servicio;
  @Output() cerrarSHEvento = new EventEmitter();
  fechaHoy: string;
  fechaIni: string;
  fechaFin: string;
  fechaSer: string;
  fechaSerIni: string;
  fechaSerFin: string;
  estado: string;
  origen: string;
  vuelo: string;
  pasajero: string;
  observaciones:string;
  cartel: string;
  destino: string;
  idservicio: string;
  comentario: string;
  vtcVis: boolean;
  display: boolean = false;
  displayfdr: boolean = false;
  servicios: Servicio[];
  servicio: Servicio;
  notificaciones: Notificaciones;
  global: Global = new Global();
  hayser: boolean;
  propietario: Propietario;
  hayParada: boolean;
  fechaParadaIni: string;
  fechaParadaFin: string;
  fechaDeRecogida:string;

  constructor(private sser: SserService, private smail: SmailService, private confirmationService: ConfirmationService) {
    this.notificaciones = new Notificaciones(smail);
  }

  ngOnInit() {
    this.getPropietario();
    this.hayParada = false;
    this.hayser = false;
    this.fechaSerFin = '';
    this.fechaSerIni = '';
    this.fechaSer = '';
    this.vtcVis = false;
    this.estado = '';
    this.idservicio = '';
    this.fechaHoy = moment().format('YYYY-MM-DD HH:mm:ss'); // THH:mm
    this.fechaIni = moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss'); // THH:mm
    this.fechaFin = moment().add(12, 'hours').format('YYYY-MM-DD HH:mm:ss'); // THH:mm
    /* console.log('ini--->>>'+this.fechaIni);
    console.log('ini--->>>'+this.fechaHoy);
    console.log('fin--->>>'+this.fechaFin); */
    let id=localStorage.getItem('servicioActual');
    if (id && !(id=="")){
      console.log("localStorage.getItem('servicioActual')="+id);
      const datos = { 'idservicio': id };
      this.sser.getServicio(JSON.stringify(datos)).subscribe(result=>{
        for(let ser of result){

          if(ser.estado==this.global.ESTADO_ANULADO || ser.estado==this.global.ESTADO_FINALIZADO){
            localStorage.removeItem('servicioActual');
            this.getSerActCon();
          }else{

            this.hayser = true;
            this.servicio = ser;
            this.fechaSerIni = this.fechTR(ser.FechaDeRecogida);
            this.fechaSerFin = this.fechTS(ser.FechaDeRecogida);
            this.fechaSer = this.fech2time(ser.FechaDeRecogida);
            this.fechaDeRecogida = moment(ser.FechaDeRecogida, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm');
            this.estado = ser.estado;
            this.origen = ser.Origen;
            this.vuelo = ser.vuelo;
            this.observaciones = ser.comentarioCli;
            this.pasajero = ser.pasajero;
            this.destino = ser.Destino;
            this.cartel = ser.cartel;
            this.idservicio = ser.idservicio;
            if (!(ser.fechaParadaIni == '') && ser.fechaParadaFin == '') {
              this.hayParada = true;
            }
          }
        }
      });

    }else{
      this.getSerActCon();
    }
  }
  getPropietario(){
    this.sser.getPropietario().subscribe(result =>{
        for(let res of result){
         this.propietario = res;
         break;
        }
    });
  }
  fech2time(fechaDeRecogida: string): string {
    return moment(fechaDeRecogida).format('HH:mm:ss');
  }
  getSerActCon() {
    this.setCurrentPosition();
    this.hayser = false;
    const ser = { 'idConductor': localStorage.getItem('idConductor'), 'fechaIni': this.fechaIni, 'fechaFin': this.fechaFin };
    this.sser.getSerActCon(JSON.stringify(ser)).subscribe(result => {
      this.servicios = result;
      for (const ser of this.servicios) {
        if (ser) {
          this.hayser = true;
          this.servicio = ser;
          this.fechaSerIni = this.fechTR(ser.FechaDeRecogida);
          this.fechaSerFin = this.fechTS(ser.FechaDeRecogida);
          this.fechaSer = this.fech2time(ser.FechaDeRecogida);
          this.fechaDeRecogida = moment(ser.FechaDeRecogida, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm');
          this.estado = ser.estado;
          this.origen = ser.Origen;
          this.vuelo = ser.vuelo;
          this.observaciones = ser.comentarioCli;
          this.pasajero = ser.pasajero;
          this.destino = ser.Destino;
          this.cartel = ser.cartel;
          this.idservicio = ser.idservicio;
          if (!(ser.fechaParadaIni == '') && ser.fechaParadaFin == '') {
            this.hayParada = true;
          }
        }
      }
    });
  }
  fechTR(fechaDeRecogida: string) {
    if (!this.servicio.tiempoMedioRecogida) this.servicio.tiempoMedioRecogida = '20';
    return this.fechaSerIni = moment(fechaDeRecogida, 'YYYY-MM-DDTHH:mm:ss').subtract(this.servicio.tiempoMedioRecogida, 'minutes').format('HH:mm:ss');
  }
  fechTS(fechaDeRecogida: string) {
    if (!this.servicio.tiempoMedioServicio) this.servicio.tiempoMedioServicio = '40';
    return this.fechaSerFin = moment(fechaDeRecogida, 'YYYY-MM-DDTHH:mm:ss').add(this.servicio.tiempoMedioServicio, 'minutes').format('HH:mm:ss');
  }
  VTC() {

  }
  notas() {
    this.display = true;
  }
  getEstadoFinalizado(): boolean {
    if (this.servicio && this.servicio.estado == this.global.ESTADO_FINALIZADO) return true;
    else return false;
  }
  guardaTiempoER() {
    this.servicio.tiempoInicioRuta = moment().format('YYYY-MM-DDTHH:mm:ss');
    // console.log('ini--->>>'+this.servicio.tiempoInicioRuta);
  }
  guardaTiempoF() {
    this.servicio.tiempoFinRuta = moment().format('YYYY-MM-DDTHH:mm:ss');
    // console.log('estado--->>>'+this.servicio.tiempoFinRuta);
  }
  Anular() {
    // guardo posición.
    this.setCurrentPosition();
    /////// PUSH ADMIN ///////////////////////////////////////////////////////////////
    const datos = JSON.stringify({ 'idAdm':this.propietario.emailAdmin,
                                   'title': 'Conductor ANULA servicio', 
                                   'body': 'El conductor '+this.servicio.Conductor+' ha ANULADO el servicio '+this.servicio.idservicio+' a las '+moment().format('YYYY-MM-DDTHH:mm:ss'), 
                                   'url': 'https://admin.luxucar.es' });

    this.pushMsg(datos);
    ///////////////////////////////////////////////////////////////////////////////

    
    this.servicio.estado = this.global.ESTADO_ANULADO;
    this.servicio.tiempoFinRuta = moment().format('YYYY-MM-DDTHH:mm:ss');
    var nuevoSer = JSON.parse(JSON.stringify(this.servicio, this.replacer));
    this.sser.setServicio(nuevoSer).subscribe();
    this.cerrarSHEvento.emit();

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
  sigEstSer() {
    //  console.log('estado---<<<<<<'+this.servicio.estado);
    this.setCurrentPosition();
    const ser = { 'estado': this.servicio.estado };
    this.sser.getSerNextEstado(JSON.stringify(ser)).subscribe(result => {
      for (const res of result) {
        //console.log('estado--->>>'+JSON.stringify(res));
        this.estado = res.nombre;

        if (res.nombre == this.global.ESTADO_EN_RUTA) this.guardaTiempoER();
        if (res.nombre == this.global.ESTADO_FINALIZADO) this.guardaTiempoF();
        this.servicio.estado = res.nombre;
        var nuevoSer = JSON.parse(JSON.stringify(this.servicio, this.replacer));
        this.sser.setServicio(nuevoSer).subscribe();

        if (this.servicio.estado == this.global.ESTADO_EN_CAMINO) {
          const cliente = { 'idCliente': nuevoSer.idCliente };
          this.sser.getCliente(JSON.stringify(cliente)).subscribe(result => {
            for (const res of result) {
              if (res && res.recibirNot=='1') this.notificaciones.sendEnCaminoMail(res.email, nuevoSer, localStorage.getItem('vehiculo') + ': matrícula(' + localStorage.getItem('matricula') + ')');
            }
          });
        }
        if (this.servicio.estado == this.global.ESTADO_EN_POSICION) {
          const cliente = { 'idCliente': nuevoSer.idCliente };
          this.sser.getCliente(JSON.stringify(cliente)).subscribe(result => {
            for (const res of result) {
              if (res && res.recibirNot=='1') this.notificaciones.sendPosicionMail(res.email, nuevoSer, localStorage.getItem('vehiculo') + ': matrícula(' + localStorage.getItem('matricula') + ')');
            }
          });
        }
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
  guardarComentario() {
    //console.log('comentario--->>>'+this.comentario);
    this.servicio.comentarioCon = this.comentario;
    this.sser.setServicio(this.servicio).subscribe();

  }
  borrarComentario() {
    this.comentario = "";
    //console.log('comentario--->>>'+this.comentario);
  }
  getEstadoEnRutaIniP(): boolean {
    return ((!this.hayParada) && (this.servicio.estado == this.global.ESTADO_EN_RUTA ? true : false));
  }
  getEstadoEnRutaFinP(): boolean {
    return (this.hayParada && (this.servicio.estado == this.global.ESTADO_EN_RUTA ? true : false));
  }
  iniParada() {
    this.hayParada = true;
    this.servicio.parada = '1';
    this.servicio.fechaParadaIni = moment().format('YYYY-MM-DD HH:mm:ss');
    this.servicio.fechaParadaFin = '';
    this.servicio = JSON.parse(JSON.stringify(this.servicio, this.replacer));
    //guardo servicio con parada y horaini
    this.sser.setServicio(this.servicio).subscribe();
  }
  finParada() {
    this.hayParada = false;
    this.servicio.fechaParadaFin = moment().format('YYYY-MM-DD HH:mm:ss');
    this.servicio.tiempoDeEspera = this.servicio.tiempoDeEspera + this.difTE();

    this.servicio.fechaParadaIni = '';
    this.servicio.fechaParadaFin = '';
    this.servicio = JSON.parse(JSON.stringify(this.servicio, this.replacer));
    //guardo servicio con parada y horaini
    this.sser.setServicio(this.servicio).subscribe();
  }
  difTE(): number {
    const milisec = ((moment(this.servicio.fechaParadaFin).toDate().getTime()) - (moment(this.servicio.fechaParadaIni).toDate().getTime()));
    //console.log('milisec='+milisec);
    const min = milisec / 60000;
    return this.round1(min, 2);
  }
  actualizarConEspera() {
    setTimeout(function () {
      this.actualizar();
    }.bind(this), 2500);

  }
  round1(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  incidencia() {
    this.confirmationService.confirm({
      message: 'Va a liberar el servicio por una incidencia ¿Esta seguro?',
      accept: () => {

        // guardo posición.
        this.setCurrentPosition();
        /////// PUSH ADMIN ///////////////////////////////////////////////////////////////
        const datos = JSON.stringify({ 'idAdm':this.propietario.emailAdmin, 
                                       'title': 'Conductor LIBERA servicio', 
                                       'body': 'El conductor '+this.servicio.Conductor+' ha LIBERADO el servicio '+this.servicio.idservicio+' a las '+moment().format('YYYY-MM-DDTHH:mm:ss'), 
                                      'url': 'https://admin.luxucar.es' });

        this.pushMsg(datos);
        ///////////////////////////////////////////////////////////////////////////////

        this.servicio.estado = this.global.ESTADO_EN_PETICION;
        this.servicio.comentarioCon = '¡¡ EL CONDUCTOR ' + this.servicio.Conductor + ' (' + this.servicio.idConductor + ')' + ' HA NOTIFICADO UNA INCIDENCIA!!  ';
        this.renovarHoraDerecogida();
        var nuevoSer = JSON.parse(JSON.stringify(this.servicio, this.replacer));
        this.sser.setServicio(nuevoSer).subscribe();

        this.cerrarSHEvento.emit();
      }
    });
  }

  postponer(){
    this.displayfdr=true;
  }
  guardarPostponer() {
    this.confirmationService.confirm({
      message: 'Va a postponer el servicio ¿Esta seguro?',
      accept: () => {
        this.servicio.FechaDeRecogida =  moment(this.fechaDeRecogida,['YYYY-MM-DD HH:mm:ss Z','DD/MM/YYYY HH:mm']).format('YYYY-MM-DD HH:mm:ss')
        var nuevoSer = JSON.parse(JSON.stringify(this.servicio, this.replacer));
        this.sser.setServicio(nuevoSer).subscribe();
        this.cerrarSHEvento.emit();
      }
    });
  }
  renovarHoraDerecogida() {

    let t0 = moment(this.servicio.FechaDeRecogida).toDate().getTime();
    let t1 = moment().toDate().getTime();
    if (t1 > t0) {
      this.servicio.comentarioCon += 'Fecha de recogida anterior::' + this.servicio.FechaDeRecogida;
      this.servicio.FechaDeRecogida = moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
    }
  }
  pushMsg(datos:string){
   this.sser.sendPush(datos).subscribe();
  }
}
