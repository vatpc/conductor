import { Component, OnInit } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../servicios/sser.service';
import { HttpModule } from '@angular/http';
import { Propietario } from '../comun/propietario';
import { Global } from '../comun/global';

@Component({
  selector: 'app-res-gan',
  templateUrl: './res-gan.component.html',
  styleUrls: ['./res-gan.component.css'],
  providers: [SserService]
})
export class ResGanComponent implements OnInit {

  base = 0;
  iva = 0;
  fechaUltimaDef:string;
  fechaUltFact: string;
  servicios: Servicio[];
  vtcVis:boolean=false;
  servicioAct:Servicio;
  global: Global = new Global();
  propietario: Propietario;

  constructor(private sser: SserService) { }

  ngOnInit() { 
    this.getPropietario();
    //this.fechaUltimaDef = moment().subtract( 1 ,'months').format('YYYY-MM-DD');
    this.fechaUltimaDef = moment().startOf('month').subtract(1,'month').format('YYYY-MM-DD');
    this.getUltFechFact();
   
  }
  getSerFact() {
    //No hay ultima fech fact
    //console.log('-------------->>>>'+this.fechaUltFact);
    if(!this.fechaUltFact){
      this.fechaUltFact=this.fechaUltimaDef
    }
    this.base =0;
    const datos = { 'idConductor': localStorage.getItem('idConductor'),"fech":this.fechaUltFact };
    this.sser.getSerFactComp(JSON.stringify(datos)).subscribe(result => {
      this.servicios = result;
      console.log("num="+this.servicios.length);
      for (let ser of this.servicios) {
        this.base += this.getCalc(ser);
        if (ser.estado == this.global.ESTADO_FINALIZADO) {
          if (ser.tarificacionPorTiempo == 1) {
            if(this.getCantDispo(ser)>1) this.base += this.getValDispo(ser);
          }
        }
      }
      
      this.base = this.round1(+this.base, 1);
    });
  }

  getUltFechFact() {
    const datos = JSON.stringify({ 'idCompania': localStorage.getItem('idCompania') });
    this.sser.getCondFact(datos).subscribe(result => {
      for (const res of result) {
        if (res) {
          this.fechaUltFact = res.fechaFin;
          
        }
      }
      this.getSerFact();
    });
  }
  verVtc(servicio){
    this.servicioAct=servicio;
    this.vtcVis=!this.vtcVis;
  } 
  
  fech2time(fechaDeRecogida: string): string {
    return moment(fechaDeRecogida).format('HH:mm:ss');
  }
  fech2Prety(fechaDeRecogida: string): string {
    moment.locale('es');
    return moment(fechaDeRecogida).format('LL');
  }

  getCalc(ser: Servicio): number {
   
    if (ser.estado == this.global.ESTADO_FINALIZADO) {
      if (ser.tarificacionPorTiempo == 0) {
        let a = Number(this.getCalc1(ser));
        return a;
      } else {
        
         let a = Number(this.getCalc2(ser));
         //if(ser.idservicio=="2748")console.log("2748 a="+a);
        return a;
      }
    } else if (ser.estado == this.global.ESTADO_ANULADO) {
      let iva = +this.propietario.iva;
      let tiempoMaxAnulacion = +this.propietario.tiempoMaxAnulacion;
      let tarifaAnulacionIva = +ser.tarifaAnuCon ;

      let tFR = moment(ser.tiempoFinRuta, ['YYYY-MM-DD HH:mm:ss Z', 'DD/MM/YYYY HH:mm']).toDate().getTime();
      let fFR = moment(ser.FechaDeRecogida, ['YYYY-MM-DD HH:mm:ss Z', 'DD/MM/YYYY HH:mm']).toDate().getTime();

      let dif = this.round1(((fFR - tFR) / 60000), 1);

      if (dif < tiempoMaxAnulacion) {
        return Number(tarifaAnulacionIva);
      } else {
        return 0;
      }
    }
  }
  //Finalizado-Por ruta tarifa y paradas
  getCalc1(servicio: Servicio) {
    
    let a = 0;
    let iva = +this.propietario.iva;
    let tarifaParadaSinIva = +servicio.tarifaParadaCon ;
    let tarifaSinIva = +servicio.tarifaConductor;
    let tarifaAnulacionSinIva = +servicio.tarifaAnuCon ;

    if (servicio.parada && ((+servicio.tiempoDeEspera) >= (+this.propietario.tiempoParadaCortesia))) {
      a = ((tarifaParadaSinIva) * (+servicio.tiempoDeEspera)) / 60;
      a = this.round1(a, 1);
    }
    if (servicio.estado == this.global.ESTADO_FINALIZADO) return (tarifaSinIva + a);
    else return (tarifaAnulacionSinIva);
  }
  //Finalizado-por tiempo tarifa * minutos diff
  getCalc2(servicio: Servicio) {

    // quito ivas y busco la diff en minutos para la base total
    let iva = +this.propietario.iva;
    let tarifaSinIva = +servicio.tarifaConductor;
    let val = this.getCant(servicio);
    return this.round1((tarifaSinIva * val), 1);
  }
  //Finalizado-Por tiempo tarifa Sin Iva para la unidad
  getCalc3(ser: Servicio) {
    if (ser.estado == this.global.ESTADO_FINALIZADO) {
      if (ser.tarificacionPorTiempo == 1) {
        // quito ivas y busco la diff en minutos para la base
        let iva = +this.propietario.iva;
        let tarifaSinIva = +ser.tarifaConductor;
        let val = 1;
        return this.round1((tarifaSinIva * val), 1);

      } else {
        //console.log('|ooooooo getCalc3 2 ooooooooo|>>>>>>'+ser.idservicio);
        return this.getCalc2(ser);
      }
    } else {
      //console.log('|ooooooo getCalc3 3 ooooooooo|>>>>>>'+ser.idservicio);
      return this.getCalc(ser);
    }
  }

  getCant(ser: Servicio): number {
    let val = 1;
    return val;
  }

  //calcula el numero de unidades de una dispo
  getCantDispo(ser: Servicio): number {
    let val = 1;
      if (ser.tarificacionPorTiempo == 1){
      //if (ser.idservicio=='2084') console.log('>>>>>>'+2084);
      let init = moment(ser.tiempoInicioRuta, ['YYYY-MM-DD HH:mm:ss Z', 'DD/MM/YYYY HH:mm']).toDate().getTime();
      let finn = moment(ser.tiempoFinRuta, ['YYYY-MM-DD HH:mm:ss Z', 'DD/MM/YYYY HH:mm']).toDate().getTime();
      let dif = 0;
      if(init && finn){
        dif = this.round1(((finn - init) / 60000), 1);
        //val = this.round1(((dif / 60)-(+ser.tiempoTH )), 1);
        val = this.round1(((dif / 60)), 1);
      }  
      if (val < 1) val = 1;
      if ((val-Math.trunc(val))>=(+this.propietario.redondeoAlza)){
          val = Math.trunc(val)+1;
      }else{
        val = Math.trunc(val);
      }
    }
    return val;
  }

  //calcula el valor de una dispo que ha superado el tiempo minimo
  getValDispo(ser: Servicio): number {
    let val = 1;
    let tarifaParada=0;

    //if (ser.idservicio=='2084') console.log('>>>>>>'+2084);
    let init = moment(ser.tiempoInicioRuta, ['YYYY-MM-DD HH:mm:ss Z', 'DD/MM/YYYY HH:mm']).toDate().getTime();
    let finn = moment(ser.tiempoFinRuta, ['YYYY-MM-DD HH:mm:ss Z', 'DD/MM/YYYY HH:mm']).toDate().getTime();
    let dif = this.round1(((finn - init) / 60000), 1);//en minutos
    
    // si es menos del tiempo de ruta se cobra una unidad
    // si se supera, se estima el valor
    
    val = this.round1(((dif / 60)-(+ser.tiempoTH )), 1);
    
    if (val < 1) val = 1;
    if ((val-Math.trunc(val))>=(+this.propietario.redondeoAlza)){
        val = Math.trunc(val)+1;
    }else{
      val = Math.trunc(val);
    }
      //para dispos la tarfifa extra es la tarifa parada
      let iva = +this.propietario.iva;
      tarifaParada = +ser.tarifaParadaCon;


    return (val*tarifaParada);
  }


  round1(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  getPropietario () {
    let  propietarios: Propietario[];
    this.sser.getPropietario().subscribe(result => {
      propietarios = result;
      for (const prop of propietarios) {
         this.propietario = prop;
         this.iva= +this.propietario.iva;
         //console.log('this.prop---->' + prop);
         break;
      }
    });
  }


}
