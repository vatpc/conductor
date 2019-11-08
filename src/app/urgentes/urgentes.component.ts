import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../servicios/sser.service';
import { Propietario } from '../comun/propietario';
import { Servicio } from '../comun/servicio';
import { Global } from '../comun/global';

@Component({
  selector: 'app-urgentes',
  templateUrl: './urgentes.component.html',
  styleUrls: ['./urgentes.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [SserService]
})
export class UrgentesComponent implements OnInit, OnDestroy {
  @Input() urgentesVis: boolean;
  intervalId: any;
  propietario: Propietario;
  contador: number;
  visibleSidebar3;
  servicios: Servicio[];
  msg: string;
  contadorAnl = 0;
  contadorUrg = 0;
  numerodeAvisos = 0;
  numSerAnl = 0;
  numSerUrg = 0;
  global: Global = new Global();


  constructor(private sser: SserService) { }
  ngOnInit() {
    this.msg = '';
    this.contador = 1;
    this.numerodeAvisos = this.global.NUMERO_REPETICIONES_NOTIFI;
    //console.log('app-urgentes::inicio urgentes');
    this.getPropietario()
    this.intervalId = setInterval(() => this.getServicios(this.propietario), 1000 * this.global.TIEMPO_ESPERA_NOTIFI_SEG * 1);
  }
  ngOnDestroy() {
    //console.log('app-urgentes::finaliza urgentes');
    clearInterval(this.intervalId);
  }
  getPropietario() {
    var propietarios: Propietario[];
    this.sser.getPropietario().subscribe(result => {
      propietarios = result;
      for (const prop of propietarios) {
        this.propietario = prop;
        this.getServiciosUrg(prop);
        this.getServiciosAnl(prop);
        break;
      }
    });
  }
  getServicios(prop: Propietario) {
    this.getServiciosAnl(prop);
    this.getServiciosUrg(prop);
    this.getAsignados(prop);
  }
  getAsignados(prop: Propietario) {
    const ser = { 'idConductor': localStorage.getItem('idConductor') };
    this.sser.getSerAct(JSON.stringify(ser)).subscribe(result => {
      this.servicios = result;
      if (this.servicios.length > 0) {
          this.msg = "¡Tiene ASIGNADO servicios, por favor, tramítelos!";
          this.visibleSidebar3 = true;
      }
    });
  }



/**
   * Devuelve servicios urgentes si el tipo de servicio tiene las mismas categorias que el conductor logado
   * @param prop 
   */
  getServiciosUrg(prop: Propietario) {
    // consulta los servicios urgentes
    var datos = { 'horas': prop.horasUrgente, 'idTipoDeServicio': null }
    this.servicios=[];
    this.sser.getServiciosUrg(JSON.stringify(datos)).subscribe(result => {

      var serBreak = false;
      //recorre los servicios urgentes y busca las categorias asociadas a ese tipo de servicio
      for (let ser of result) {

        //consulta las categorias
        const config = JSON.stringify({ 'tabla': 'tds2cat', 'conEstado': '0' });
        const filtro = JSON.stringify({ 'filtro': 'idtds', 'valor': ser.idTipoDeServicio, 'traza': '0' });

        this.sser.lista(config, null, filtro,null,null).subscribe(result => {

          var catBreak = false;
          var catOfTds = result;
          for (let cat of catOfTds) {
            //para cada categoria consulta los conductores 
            const datos = JSON.stringify({ 'idCategoria': cat.idcat });
             this.sser.getCondFromCat(datos).subscribe(resp => {
              //para el conductor logado
              let id = localStorage.getItem('idConductor');
              var conds = resp;
              for (let cond of conds) {
                 if (cond.id == id) {
                  //este conductor tiene la categoria asociada, asi que añado el servicio urgente
                  this.servicios.push(ser);
                  //Notifico que hay urgentes y no voy al siguiente servicio
                  this.setNotifiUrg();
                  catBreak = true;
                  serBreak = true;
                  break;
                } 
              }

            });
            if (catBreak) break;
          }
        });
        if (serBreak) break;
      }
    });
  }


// Notifica q hay servicios urgentes
  setNotifiUrg(){
    if (this.servicios.length > 0) {
      if (this.contadorUrg <= this.numerodeAvisos) {
        this.contadorUrg++;
        this.numSerUrg = this.servicios.length;
        this.msg = "¡Han llegado servicios urgentes!";
        this.visibleSidebar3 = true;
      } else if ((this.contadorUrg > this.numerodeAvisos) && !(this.servicios.length == this.numSerUrg)) {
        this.contadorUrg = 1;
        this.numSerUrg = this.servicios.length;
        this.msg = "¡Han llegado servicios urgentes!";
        this.visibleSidebar3 = true;
      }
    } else {
      this.contadorUrg = 0;
      this.numSerUrg = this.servicios.length;
    }
  }


  getServiciosAnl(prop: Propietario) {
    var datos = { 'horas': prop.horasUrgente, 'idConductor': localStorage.getItem('idConductor') }
    this.sser.getServiciosAnl(JSON.stringify(datos)).subscribe(result => {
      this.servicios = result;
      if (this.servicios.length > 0) {
        console.log('contadorAnl=' + this.contadorAnl);
        console.log('length=' + this.servicios.length);
        console.log('numSerAnl=' + this.numSerAnl);
        if (this.servicios.length > 0) {
          if (this.contadorAnl <= this.numerodeAvisos) {
            this.contadorAnl++;
            this.numSerAnl = this.servicios.length;
            this.msg = "¡Un cliente ha anulado algún servicio próximo a realizarse, revise su planificación!";
            this.visibleSidebar3 = true;
          } else if ((this.contadorAnl > this.numerodeAvisos) && !(this.servicios.length == this.numSerAnl)) {
            this.contadorAnl = 1;
            this.numSerAnl = this.servicios.length;
            this.msg = "¡Un cliente ha anulado algún servicio próximo a realizarse, revise su planificación!";
            this.visibleSidebar3 = true;
          }
        }
      } else {
        this.contadorAnl = 0;
        this.numSerAnl = this.servicios.length;
      }
    });
  }
}

