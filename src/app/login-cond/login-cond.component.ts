import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { AuthAdminService } from '../servicios/auth-admin.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/components/common/api';
import { Global } from '../comun/global';
import { Propietario } from '../comun/propietario';
import { SserService } from '../servicios/sser.service';
import { UsuariosService } from '../servicios/usuarios.service';
//import {MessageService} from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';


@Component({
  selector: 'app-login-cond',
  templateUrl: './login-cond.component.html',
  styleUrls: ['./login-cond.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthAdminService, AuthService, SserService, UsuariosService] //MessageService,
})
export class LoginCondComponent implements OnInit {
  vis: boolean = false;
  msgs: Message[] = [];
  message: string;
  password: string;
  username: string;
  global: Global = new Global();
  propietario: Propietario;
  coordinador: boolean = false;

  public version: string = environment.VERSION;

  constructor(public authService: AuthService, public authAdminService: AuthAdminService,
    private sser: SserService, private router: Router,
    private usuariosService: UsuariosService) { //, private messageService: MessageService

  }

  ngOnInit() {
  }
  /////////////////////////////////////////////////////////////////
  getTknAdm(tipo: string) {
    this.usuariosService.getTkn(tipo).subscribe(result => {
      for (let res of result) {
        localStorage.setItem('tkn', res.tkn);
        this.getPropietarioAdm();
      }
    });
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
              this.showError();
            }
          });
        break;
      }
    });
  }
  //////////////////////////////////////////////////////////////////////
  getTknCond(tipo: string) {
    this.usuariosService.getTkn(tipo).subscribe(result => {
      for (let res of result) {
        localStorage.setItem('tkn', res.tkn);
        this.getPropietarioCond();
      }
    });
  }
  getPropietarioCond() {
    this.authService.login(this.username, this.password).subscribe(
      data => {
        if (data !== 'NOK') {
          this.router.navigate(['/']);
        } else {
          this.showError();
        }
      });
  }
  ///////////////////////////////////////////////////////////////////////
  getTknCoord(tipo: string) {
    this.usuariosService.getTkn(tipo).subscribe(result => {
      for (let res of result) {
        localStorage.setItem('tkn', res.tkn);
        this.getPropietarioCoord();
      }
    });
  }
  getPropietarioCoord() {
    var tkn = localStorage.getItem('tkn');
    
     this.authAdminService.loginCoor(this.username, this.password).subscribe(
      data => {
        console.log('::::::::::::::>>>>>'+data);
        if (data !== 'NOK') {

          this.authAdminService.loginCoor_(data).subscribe(result=>{
            this.router.navigate(['/']);
          });
          
        } else {
          this.showError();
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
    this.msgs.push({severity:'error', summary:'La contraseña que ingresaste es incorrecta o el usuario no existe.', detail:'Intentelo de nuevo'});
  } 
  resolve() {
    this.vis = false;
    this.msgs = [];
  }
}
