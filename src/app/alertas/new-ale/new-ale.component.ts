import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SserService } from '../../servicios/sser.service';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { Servicio } from '../../comun/servicio';
import { Notificaciones } from '../../comun/notificaciones';
import { SmailService } from '../../servicios/smail.service';
import { Message } from 'primeng/api';
import { Global } from '../../comun/global';
import { Alertas } from '../../comun/alertas';
import { ConfirmationService } from 'primeng/api';
import { Alert } from 'selenium-webdriver';
import { Propietario } from '../../comun/propietario';
import { ConfirmDialog } from 'primeng/primeng';

@Component({
  selector: 'app-new-ale',
  templateUrl: './new-ale.component.html',
  styleUrls: ['./new-ale.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [SserService, ConfirmationService]
})
export class NewAleComponent implements OnInit {

  nuevaAle:Alertas= new Alertas();
  propietario:Propietario;
  @Input() visible;
  @Output() cerrarNAEvento = new EventEmitter();
  global: Global = new Global();

  constructor(private sser: SserService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getPropietario();
    this.nuevaAle.importancia="Informativo";
  }
  estaSeguro(){
    //console.log("Llego a envio la alerta");
    this.confirmationService.confirm({
      message: '¿Esta seguro de enviar la alerta?',
      header: '¡¡¡ Atención !!!',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.enviar();
      },
      reject: () => {
        //console.log("No envio la alerta");
      }
    });

  }
  enviar(){
    if(this.nuevaAle.cuerpo && this.nuevaAle.titulo && !(this.nuevaAle.titulo=="") && !(this.nuevaAle.cuerpo=="")){
      this.nuevaAle.de = localStorage.getItem('username');
      if(localStorage.getItem('username') == this.global.USER_ADMIN){
        this.nuevaAle.de = localStorage.getItem('condSupl');
      }
      this.nuevaAle.para = this.propietario.emailAdmin;
      this.nuevaAle.fechaAlta = moment().format('YYYY-MM-DD HH:mm:ss');
      this.nuevaAle.estado = "Activo";

      //console.log("Envio la alerta--->>>"+JSON.stringify(this.nuevaAle));
      var config = JSON.stringify({"tabla":"alertas"});
      var datos = JSON.stringify(this.nuevaAle);

      this.sser.nuevo(config,datos).subscribe();
      this.visible= false;
      this.cerrarNAEvento.emit();
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
}

