import { Component, OnInit } from '@angular/core';
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
import { SmailService } from '../servicios/smail.service';
import { Global } from '../comun/global';
import { Vehiculo } from '../comun/vehiculo';
import { Message } from 'primeng/components/common/api';



@Component({
  selector: 'app-asg-veh',
  templateUrl: './asg-veh.component.html',
  styleUrls: ['./asg-veh.component.css'],
  providers: [SserService]
})
export class AsgVehComponent implements OnInit {
  vehiculos: Vehiculo[];
  idVehiculo: string = localStorage.getItem('idVehiculo');
  idConductor: string = localStorage.getItem('idConductor');
  urlFoto: string ;
  uploadedFiles: any[] = [];
  fileToUpload: File = null;
  global: Global = new Global();
  
  @Output() cerrarAsgVehEvento = new EventEmitter();

  msgs: Message[] = [];

  constructor(private sser: SserService) {

  }

  ngOnInit() {
    console.log("localStorage.getItem('urlFoto')------------------------>>>>"+localStorage.getItem('urlFoto'));
    if (localStorage.getItem('urlFoto') == 'null') {
      this.urlFoto = "https://luxucar.es/imag_cond/vatpc0_gmail.com/nohayfoto.jpg";
      console.log("localStorage.getItem('urlFoto')------------------------>>>>"+localStorage.getItem('urlFoto'));
    }else{
      this.urlFoto = localStorage.getItem('urlFoto');
      
    }
    console.log('idVehiculo=' + this.idVehiculo);
    this.getVehiculos();
  }
  getVehiculos() {
    const vehiculo = JSON.stringify({ 'idCompania': localStorage.getItem('idCompania') });
    this.sser.getVehiculos(vehiculo).subscribe(result => {
      this.vehiculos = result;
    });
  }
  actualizaVehiculo(id: string) {

    localStorage.setItem('idVehiculo', id);
    const vehiculo = JSON.stringify({ 'id': this.idConductor, 'idVehiculo': id });

    this.sser.setVeh2Cond(vehiculo).subscribe();

    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.postFile();
  }
  replacer(key, value) {
    if (value === null) {
      return undefined;
    }
    else {
      return value;
    }
  }
  postFile() {
    if (this.fileToUpload) {

      let email = localStorage.getItem('email');
      var re = /\@/g;
      email = email.replace(re, '_');

      this.sser.envioFoto(this.fileToUpload, email + '/').subscribe(
        res => {
          let cond = JSON.stringify({ 'id': localStorage.getItem('idConductor') });
          this.sser.getConductores(cond).subscribe(result => {
            if (result){
              let conductor = result[0];
              
              let ext = this.fileToUpload.name;
              let e = ext.split('.');
              ext = e[(e.length - 1)];
              conductor.compania=null;
              conductor.id=conductor.id+'';
              conductor.urlFoto = this.global.SERVIDOR_URL + this.global.DIRBASE_IMG_COND + email + '/' + this.global.COND_LOG_NAME + '.' +ext;
              localStorage.setItem('urlFoto', conductor.urlFoto);
              conductor = JSON.parse(JSON.stringify(conductor, this.replacer));
              this.sser.upConductor(JSON.stringify(conductor)).subscribe();
              this.cerrarAsgVehEvento.emit();

            }
          });
        });
    }
  }
  notify(){
    //this.sser.sendPush().subscribe();

  }

}
