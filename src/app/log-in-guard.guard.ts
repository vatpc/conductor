import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from './servicios/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class LogInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    //this.router.navigate(['/']);
    const isLogIn = this.authService.isLoggedIn();
    if ( !isLogIn ) {
      // console.log('canActivate, isNOTLogIn');
      this.router.navigate(['/loginCond']);
    }
    return isLogIn;
  }
}
