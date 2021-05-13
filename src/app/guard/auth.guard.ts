import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( public authService: AuthService, public router: Router ){ 
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const expectedRole = route.data.expectedRole;
    const logged = this.authService.isLoggedIn();
    
    const roles = ["reader", "vip", "worker", "admin"];
    const expectedRoleIndex = roles.indexOf(expectedRole);
    const roleIndex = roles.indexOf(localStorage.getItem('role'));

    if(!logged || roleIndex < expectedRoleIndex){
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
