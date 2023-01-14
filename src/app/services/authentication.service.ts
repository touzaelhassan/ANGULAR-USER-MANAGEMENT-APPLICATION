import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {

    public host = environment.APIEnpointsURL;
    private token: any;
    private loggedInUserInformation: any;
    private jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient) { }

    public register(user: User) :Observable<User> { return this.http.post<User>(`${this.host}/api/authentication/register`, user); }

    public login(user: User) :Observable<HttpResponse<User>> { 
        return this.http.post<User>(`${this.host}/api/authentication/login`, user, { observe:'response' }); 
    }

    public logout() : void {
        this.token = null;
        this.loggedInUserInformation = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('users');
    }

    public isUserLoggedIn() : any {
        this.loadToken();
        if (this.token != null && this.token !== '') {
            if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
                if (!this.jwtHelper.isTokenExpired(this.token)) {
                    this.loggedInUserInformation = this.jwtHelper.decodeToken(this.token);
                    return true; 
                }
            }
        }else{
            this.logout();
            return false;
        }
    }

    public saveTokenInLocalStorage(token : string): void { 
        this.token = token; 
        localStorage.setItem('token', token); 
    }
    
    public loadToken(): void { this.token = localStorage.getItem('token'); }
    public getToken(): string { return this.token; }
    public saveUserInLocalStorage(user: User): void { localStorage.setItem('user', JSON.stringify(user)); }
    public getUserFromLocalStorage(): User { return JSON.parse(localStorage.getItem('user') || ''); }

}
