
import { Router, ActivatedRoute } from '@angular/router';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { AuthAdminService } from '../servicios/auth-admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/components/common/api';
import { Global } from '../comun/global';
import { Propietario } from '../comun/propietario';
import { SserService } from '../servicios/sser.service';
import { UsuariosService } from '../servicios/usuarios.service';
//import {MessageService} from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-log-aut',
  templateUrl: './log-aut.component.html',
  styleUrls: ['./log-aut.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthAdminService, AuthService, SserService, UsuariosService]
})
export class LogAutComponent implements OnInit {
  vis: boolean = false;
  msgs: Message[] = [];
  message: string;
  password: string;
  tkn: string;
  username: string;
  global: Global = new Global();
  propietario: Propietario;
  coordinador: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,
    public authService: AuthService, public authAdminService: AuthAdminService,
    private sser: SserService,
    private usuariosService: UsuariosService) {

    if (this.route.snapshot.queryParams) {
      //console.log(":::::::::::>>>>>>>>" + this.route.snapshot.params); // e.g. :param1 in routeConfig
      if (this.route.snapshot.queryParamMap.get('user') && this.route.snapshot.queryParamMap.get('pass') && this.route.snapshot.queryParamMap.get('tkn')) {
        this.password = this.route.snapshot.queryParamMap.get('pass');
        this.username = this.route.snapshot.queryParamMap.get('user');
        this.tkn      = this.route.snapshot.queryParamMap.get('tkn');

        this.login();
      } else {
        localStorage.clear();
        this.router.navigate(['loginCond']);
      }
    }

  }

  ngOnInit() {
  }
  /////////////////////////////////////////////////////////////////
  getTknAdm(tipo: string) {
    if (this.tkn) {
      localStorage.setItem('tkn', this.tkn);
      this.getPropietarioAdm();

    }
  }
  getPropietarioAdm() {
    var tkn = localStorage.getItem('tkn');
    let propietarios: Propietario[];
    this.sser.getPropietarioTkn(tkn).subscribe(result => {
      propietarios = result;
      for (const prop of propietarios) {
        this.authAdminService.login(this.username, this.password, prop).subscribe(
          data => {
            if (data !== 'NOK') {
              this.router.navigate(['/']);
            } else {
              localStorage.clear();
              this.router.navigate(['loginCond']);
            }
          });
        break;
      }
    });
  }
  //////////////////////////////////////////////////////////////////////
  getTknCond(tipo: string) {
    if (this.tkn) {
      localStorage.setItem('tkn', this.tkn);
      this.getPropietarioCond();

    }
  }
  getPropietarioCond() {
    this.authService.login(this.username, this.password).subscribe(
      data => {
        if (data !== 'NOK') {
          this.router.navigate(['/']);
        } else {
          localStorage.clear();
          this.router.navigate(['loginCond']);
        }
      });
  }
  ///////////////////////////////////////////////////////////////////////
  getTknCoord(tipo: string) {
    if (this.tkn) {
      localStorage.setItem('tkn', this.tkn);
        this.getPropietarioCoord();
      }
  }
  getPropietarioCoord() {
    var tkn = localStorage.getItem('tkn');

    this.authAdminService.loginCoor(this.username, this.password).subscribe(
      data => {
        if (data !== 'NOK') {
          this.authAdminService.loginCoor_(data).subscribe(result => {
            this.router.navigate(['/']);
          });

        } else {
          localStorage.clear();
          this.router.navigate(['loginCond']);
        }
      });
  }
  /////////////////////////////////////////////////////////////////



  login(): boolean {
    if (!this.coordinador) {
      if (this.username == this.global.USER_ADMIN) {
        this.getTknAdm('3');
      } else {
        this.getTknCond('3');
      }
    } else {

      this.getTknCoord('3');
    }
    return false;
  }


  logout(): boolean {
    this.authService.logout();
    return true;
  }
  showError() {
    this.vis = true;
    this.msgs = [];
    //this.messageService.clear();
    //this.msgs.push({ severity: 'error', summary: 'La contraseña que ingresaste es incorrecta o el usuario no existe.', detail: 'Autenticación' });
    /*  this.messageService.add({key: 'custom', severity:'error', summary: '¡¡Error!!', detail:'La contraseña que ingresó es incorrecta o el usuario no existe'});
     setTimeout(() => this.resolve(), 2000)*/
    this.msgs.push({ severity: 'error', summary: 'La contraseña que ingresaste es incorrecta o el usuario no existe.', detail: 'Intentelo de nuevo' });
    console.log
  }
  resolve() {
    this.vis = false;
    this.msgs = [];
  }
}
