import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SwPush, SwUpdate } from "@angular/service-worker";

import { SserService } from "./servicios/sser.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Conductor';

  vapidKeys = {
    "publicKey": "BNA7JDQrcAbHb3HMMgmQNeDHPprlkgaGA1WBDyHGl8nvzCIuS3QwEEqLCnOhVrFg6nJqmipkRhxYcS7HGC_Qzgs",
    "privateKey": "SLKknD7_Q1H4UW49ItP3wtrKRSElBvmlhTVeZ4siP-w"
  };


  constructor( private swPush: SwPush, private sser: SserService) {

   
      if (this.swPush.isEnabled) {
        this.swPush.requestSubscription({
          serverPublicKey: this.vapidKeys.publicKey
        })
          .then(sub => {
            localStorage.setItem('Tmpsub', JSON.stringify(sub));
          })
          .catch(err => console.error("No se puede suscribir a las notificaciones", err));


      } else {
        console.log("Warning::::::> No hay service worker");
      }
  }

}
