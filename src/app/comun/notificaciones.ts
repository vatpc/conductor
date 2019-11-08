import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import {HttpModule} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { SmailService } from '../servicios/smail.service';
import { Servicio } from '../comun/servicio';
import { Propietario } from '../comun/propietario';
import { Conductor } from '../comun/conductor';

export class Notificaciones {
    
    propietario:Propietario;
    smail:SmailService;

    constructor(smail:SmailService) {
        this.smail = smail;
        this.getPropietario();
    }
    sendReservadoMail(cliEmail:string, servicio:Servicio){
      let telf = localStorage.getItem('telefono');
      if(cliEmail==null) cliEmail=this.propietario.emailNotificaciones;
        const msg ="<!doctype html>"+
        "<html>"+
        "<head>"+
        "	<meta charset=\"utf-8\">"+
        "	<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">"+
        "	<title>LUXUCAR</title>"+
        "</head>"+
        "<body>"+
        "<img class=\"img-responsive center-block\" src=\"" +this.propietario.logo+"\" alt=\" "+this.propietario.nombreComercial+" \" ><br>"+
        "<hr>"+
        "<br>"+
        "<table class=\"table table-bordered text-center\">"+
        "  <thead>"+
        "    <tr style=\"background-color: grey;color: white\">"+
        "      <th>Fecha</th>"+
        "      <th>Origen</th>"+
        "      <th>Destino</th>"+
        "    </tr>"+
        "  </thead>"+
        "  <tbody>"+
        "    <tr style=\"background-color: lightgrey;color: darkblue\">"+
        "      <td> " +servicio.FechaDeRecogida+" </td>"+
        "      <td> " +servicio.Origen+" </td>"+
        "      <td> "+servicio.Destino+" </td>"+
        "    </tr>"+
        "  </tbody>"+
        "<tfoot>"+
        "<tr>"+
        "<th colspan=\"3\" style=\"background-color: lightgrey;color: darkblue; text-align: center\"><strong> "+servicio.Conductor+" / "+telf+" </strong></th>"+
        "</tr>"+
        "<tr>"+
        "<th colspan=\"3\" style=\"background-color: lightgrey;color: darkblue; text-align: center\"><strong>Este mensaje es solo informativo</strong></th>"+
        "</tr>"+
        "</tfoot>"+
        "</table>"+
        "<br>"+
        "<hr>"+
        "<br>"+
        "</body>"+
        "</html>";
        const datos={'from':this.propietario.emailNotificaciones,'to':cliEmail,'subject': this.propietario.nombreComercial+', hemos recibido su petición','message':msg};
        this.smail.sendEmail(JSON.stringify(datos)).subscribe();
      }
      sendEnCaminoMail(cliEmail:string, servicio:Servicio,descCoche:string){
        
        if(cliEmail==null) cliEmail=this.propietario.emailNotificaciones;
          const msg ="<!doctype html>"+
          "<html>"+
          "<head>"+
          "	<meta charset=\"utf-8\">"+
          "	<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">"+
          "	<title>LUXUCAR</title>"+
          "</head>"+
          "<body>"+
          "<img class=\"img-responsive center-block\" src=\"" +this.propietario.logo+"\" alt=\" "+this.propietario.nombreComercial+" \" ><br>"+
          "<hr>"+
          "<br>"+
          "<table class=\"table table-bordered text-center\">"+
          "  <thead>"+
          "    <tr style=\"background-color: grey;color: white\">"+
          "      <th>Fecha</th>"+
          "      <th>Origen</th>"+
          "      <th>Destino</th>"+
          "      <th>Coche</th>"+
          "    </tr>"+
          "  </thead>"+
          "  <tbody>"+
          "    <tr style=\"background-color: blue;color: white\">"+
          "      <td> " +servicio.FechaDeRecogida+" </td>"+
          "      <td> " +servicio.Origen+" </td>"+
          "      <td> "+servicio.Destino+" </td>"+
          "      <td> "+descCoche+" </td>"+
          "    </tr>"+
          "  </tbody>"+
          "<tfoot>"+
          "<tr>"+
          "<th colspan=\"4\" style=\"background-color: blue;color: white; text-align: center\"><strong>Nuestro conductor está en camino, en breve, estará en la zona acordada, muchas gracias.</strong></th>"+
          "</tr>"+
          "</tfoot>"+
          "</table>"+
          "<br>"+
          "<hr>"+
          "<br>"+
          "</body>"+
          "</html>";
          const datos={'from':this.propietario.emailNotificaciones,'to':cliEmail,'subject': this.propietario.nombreComercial+', Nuestro conductor se dirige a recogerlo','message':msg};
          this.smail.sendEmail(JSON.stringify(datos)).subscribe();
        }
        sendPosicionMail(cliEmail:string, servicio:Servicio,descCoche:string){
          if(cliEmail==null) cliEmail=this.propietario.emailNotificaciones;
            const msg ="<!doctype html>"+
            "<html>"+
            "<head>"+
            "	<meta charset=\"utf-8\">"+
            "	<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">"+
            "	<title>LUXUCAR</title>"+
            "</head>"+
            "<body>"+
            "<img class=\"img-responsive center-block\" src=\"" +this.propietario.logo+"\" alt=\" "+this.propietario.nombreComercial+" \" ><br>"+
            "<hr>"+
            "<br>"+
            "<table class=\"table table-bordered text-center\">"+
            "  <thead>"+
            "    <tr style=\"background-color: grey;color: white\">"+
            "      <th>Fecha</th>"+
            "      <th>Origen</th>"+
            "      <th>Destino</th>"+
            "      <th>Coche</th>"+
            "    </tr>"+
            "  </thead>"+
            "  <tbody>"+
            "    <tr style=\"background-color: blue;color: white\">"+
            "      <td> " +servicio.FechaDeRecogida+" </td>"+
            "      <td> " +servicio.Origen+" </td>"+
            "      <td> "+servicio.Destino+" </td>"+
            "      <td> "+descCoche+" </td>"+
            "    </tr>"+
            "  </tbody>"+
            "<tfoot>"+
            "<tr>"+
            "<th colspan=\"4\" style=\"background-color: blue;color: white; text-align: center\"><strong>El conductor esta en el lugar de recogida, muchas gracias.</strong></th>"+
            "</tr>"+
            "</tfoot>"+
            "</table>"+
            "<br>"+
            "<hr>"+
            "<br>"+
            "</body>"+
            "</html>";
            const datos={'from':this.propietario.emailNotificaciones,'to':cliEmail,'subject': this.propietario.nombreComercial+', El conductor esta en el lugar de recogida.','message':msg};
            this.smail.sendEmail(JSON.stringify(datos)).subscribe();
          }
        sendNoAceptadoMail(conductorName:string, servicio:Servicio){
          const msg ="<!doctype html>"+
          "<html>"+
          "<head>"+
          "	<meta charset=\"utf-8\">"+
          "	<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">"+
          "	<title>LUXUCAR</title>"+
          "</head>"+
          "<body>"+
          "<img class=\"img-responsive center-block\" src=\"" +this.propietario.logo+"\" alt=\" "+this.propietario.nombreComercial+" \" ><br>"+
          "<hr>"+
          "<br>"+
          "<table class=\"table table-bordered text-center\">"+
          "  <thead>"+
          "    <tr style=\"background-color: grey;color: white\">"+
          "      <th>Fecha</th>"+
          "      <th>Origen</th>"+
          "      <th>Destino</th>"+
          "      <th>Conductor</th>"+
          "    </tr>"+
          "  </thead>"+
          "  <tbody>"+
          "    <tr style=\"background-color: blue;color: white\">"+
          "      <td> " +servicio.FechaDeRecogida+" </td>"+
          "      <td> " +servicio.Origen+" </td>"+
          "      <td> "+servicio.Destino+" </td>"+
          "      <td> "+conductorName+" </td>"+
          "    </tr>"+
          "  </tbody>"+
          "<tfoot>"+
          "<tr>"+
          "<th colspan=\"4\" style=\"background-color: blue;color: white; text-align: center\"><strong>El conductor rechaza el servicio, vaya a la app para reasignarlo</strong></th>"+
          "</tr>"+
          "</tfoot>"+
          "</table>"+
          "<br>"+
          "<hr>"+
          "<br>"+
          "</body>"+
          "</html>";
          const datos={'from':this.propietario.emailNotificaciones,'to':this.propietario.emailAdmin,'subject': this.propietario.nombreComercial+', Conductor rechazó un servicio','message':msg};
          this.smail.sendEmail(JSON.stringify(datos)).subscribe();
        }
      getPropietario () {
        let  propietarios: Propietario[];
        this.smail.getPropietario().subscribe(result => {
          propietarios = result;
          for (const prop of propietarios) {
             this.propietario = prop;
             //console.log('this.prop---->' + prop);
             break;
          }
        });
      }
}
