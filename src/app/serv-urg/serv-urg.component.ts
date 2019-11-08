import { Component, OnInit } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../servicios/sser.service';
import { SmailService } from '../servicios/smail.service';
import { HttpModule } from '@angular/http';
import { Notificaciones } from '../comun/notificaciones';
import { Cliente } from '../comun/cliente';
import { Propietario } from '../comun/propietario';
import { Global } from '../comun/global';
import { Conductor } from '../comun/conductor';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-serv-urg',
  templateUrl: './serv-urg.component.html',
  styleUrls: ['./serv-urg.component.css'],
  providers: [SserService, SmailService, ConfirmationService]
})
export class ServUrgComponent implements OnInit {
  servicios: Servicio[] = [];
  message: string[];
  sortOrder: number;
  sortOptions: any[];
  sortKey: any;
  sortField: string;
  notificaciones: Notificaciones;
  cliente: Cliente;
  propietario: Propietario;
  conductores: Conductor[];
  conds: Conductor[];
  global: Global = new Global();

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
    this.getPropietario();
  }
  fech2time(fechaDeRecogida: string): string {
    return moment(fechaDeRecogida).format('HH:mm:ss');
  }
  actualizarLista() {
    this.ngOnInit();
  }
  actualizarConEspera() {
    setTimeout(function () {
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
  replacer(key, value) {
    if (value === null) {
      return undefined;
    }
    else {
      return value;
    }
  }
  aceptarSer(servicio: Servicio) {
    var nuevoSer = JSON.parse(JSON.stringify(servicio, this.replacer));
    nuevoSer.estado = this.global.ESTADO_RESERVADO;
    nuevoSer.idConductor = localStorage.getItem('idConductor');
    nuevoSer.Conductor = localStorage.getItem('nombre');
    this.sser.setServicioU(nuevoSer).subscribe();
    //this.notCliente(nuevoSer,true);
    this.actualizarConEspera();
  }
  proponer(a: any, servicio: Servicio) {
    this.confirmationService.confirm({
      message: 'Va a proponer su candidatura al servicio ¿Esta seguro?',
      accept: () => {
        this.aceptarSer(servicio);
      }
    });
  }
  notCliente(servicio: Servicio, acepto: boolean) {
    if (acepto) {
      const cliente = { 'idCliente': servicio.idCliente };
      this.sser.getCliente(JSON.stringify(cliente)).subscribe(result => {
        for (const res of result) {

        if(res && res.recibirNot=='1')  this.notificaciones.sendReservadoMail(res.email, servicio);
        }
      });
    } else {
      this.notificaciones.sendNoAceptadoMail(localStorage.getItem('nombre'), servicio);
    }
  }
  getPropietario() {
    var propietarios: Propietario[];
    this.sser.getPropietario().subscribe(result => {
      propietarios = result;
      for (const prop of propietarios) {
        this.propietario = prop;
        this.getServicios(prop);
        break;
      }
    });
  }
  /**
   * Devuelve servicios urgentes si el tipo de servicio tiene las mismas categorias que el conductor logado
   * @param prop 
   */
  getServicios(prop: Propietario) {
    this.servicios=[];
    // consulta los servicios urgentes
    var datos = { 'horas': prop.horasUrgente, 'idTipoDeServicio': null }

    this.sser.getServiciosUrg(JSON.stringify(datos)).subscribe(result => {

      //recorre los servicios urgentes y busca las categorias asociadas a ese tipo de servicio
      for (let ser of result) {

        //consulta las categorias
        const config = JSON.stringify({ 'tabla': 'tds2cat', 'conEstado': '0' });
        const filtro = JSON.stringify({ 'filtro': 'idtds', 'valor': ser.idTipoDeServicio, 'traza': '0' });

        this.sser.lista(config, null, filtro, null,null).subscribe(result => {

          var catOfTds = result;
          var catBreak = false;
          for (let cat of catOfTds) {
            //para cada categoria consulta los conductores 
            const datos = JSON.stringify({ 'idCategoria': cat.idcat });

            this.sser.getCondFromCat(datos).subscribe(result1 => {
              //para el conductor logado
              let id = localStorage.getItem('idConductor');

              for (let cond of result1) {
                if (cond.id == id) {
                  //este conductor tiene la categoria asociada, asi que añado el servicio urgente
                  this.servicios.push(ser);
                  //voy al siguiente servicio
                  catBreak = true;
                  break;
                }
              }
            });
            if (catBreak) break;
          }
        });
      }
    });
  }
  notify(){
    //this.sser.
  }
}