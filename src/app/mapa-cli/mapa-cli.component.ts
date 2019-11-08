import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { Conductor } from '../comun/conductor';
import * as moment from 'moment';
declare const google: any;
import { SserService } from '../servicios/sser.service';

@Component({
  selector: 'app-mapa-cli',
  templateUrl: './mapa-cli.component.html',
  styleUrls: ['./mapa-cli.component.css'],
  providers: [SserService]
})
export class MapaCliComponent implements OnInit {
  title: string = 'Mapa de mi localización, que ve el cliente';
  idConductor:string;
  conductorNombre:string;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  public latitude: number;
  public longitude: number;
  markers: google.maps.Marker[] = [];
  conductores: Conductor[];
  idCondAct: string;
  extbool: boolean;


  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private sser: SserService) { }

  ngOnInit() {

    this.idConductor = localStorage.getItem('idConductor');
    this.conductorNombre = localStorage.getItem('nombre');

    this.latitude = 40.416775;
    this.longitude = -3.703790;
    var mapProp = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    let location = new google.maps.LatLng(this.latitude, this.longitude);
    this.map.panTo(location);

    let horaCoche = moment().toDate().getTime();
    let now = moment().toDate().getTime();
    let dif = this.round1(((now - horaCoche) / 60000), 1);

    this.getPosicion();

  }
  round1(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  recargarPos() {
    this.dropMarkets();
    this.getPosicion();
  }
  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }
  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    this.map.setZoom(9);
  }
  dropMarkets() {
    for (let m of this.markers) {
      m.setMap(null);
    }
  }
  getPosicion() {
    const config = JSON.stringify({ 'tabla': 'posiciones', 'conEstado': '0' });
    this.sser.lista(config, null, null, null, null).subscribe(result => {
      if (result && result.length > 0) {
        for (let res of result) {
          if ( res.idConductor== this.idConductor) {
             this.showPosition(res.latitud, res.longitud, this.conductorNombre, this.idConductor, res.ultimaActualizacion);
          }
        }
      }
    });
  }
  showPosition(latitude: number, longitude: number, Conductor: string, idConductor: string, tiempo: string) {
    let location = new google.maps.LatLng(latitude, longitude);
    this.map.panTo(location);

    let horaCoche = moment(tiempo, 'YYYY-MM-DD HH:mm:ss').toDate().getTime();;
    let now = moment().toDate().getTime();
    let dif = this.round1(((now - horaCoche) / 60000), 1);

    let iconKURL;
    if (dif > 5) {
      iconKURL = "assets/img/pin1.png"
    } else {
      iconKURL = "assets/img/pin2.png"
    }
    if (this.extbool==true && dif > 5) {

    }else{
      let marker = new google.maps.Marker({
        position: location,
        map: this.map,
        //draggable: true,
        icon: iconKURL,
        title: ' ' + Conductor + ' (' + tiempo + ')'
      });
      marker.addListener('click', () => {
        this.markerHandler(marker);
      });
      this.markers.push(marker);
    }
  }
  markerHandler(marker: google.maps.Marker) {
    alert('Conductor: ' + marker.getTitle());
  }
}
