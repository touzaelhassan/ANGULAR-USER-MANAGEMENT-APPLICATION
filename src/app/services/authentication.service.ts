import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {

  private host = environment.APIEnpointsURL;
  private token: any;
  private loggedInUsername: any;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public register(user: User) :Observable<User | HttpErrorResponse> {
      return this.http.post<User | HttpErrorResponse>(`${this.host}/user/register`, user);
  }

  public login(user: User) :Observable<HttpResponse<any> | HttpErrorResponse> {
      return this.http.post<HttpResponse<any> | HttpErrorResponse>(`${this.host}/user/login`, user, {observe:'response'});
  }

  public logout() : void {
      this.token = null;
      this.loggedInUsername = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('users');
  }

  public isUserLoggedIn() : boolean {

      this.loadToken();

      if (this.token != null && this.token !== '') {
          if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
              if (!this.jwtHelper.isTokenExpired(this.token)) {
                  this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
                  return true; 
              }
          }
      }else{
          this.logout();
          return false;
      }
  }

  public saveTokenInLocalStorage(token : string): void { this.token = token; localStorage.setItem('token', token); }
  public loadToken(): void { this.token = localStorage.getItem('token'); }
  public getToken(): string { return this.token; }
  public saveUserInLocalStorage(user: User): void { localStorage.setItem('user', JSON.stringify(user)); }
  public getUserFromLocalStorage(): User { return JSON.parse(localStorage.getItem('user')); }

}
