import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {

  private host = environment.APIEnpointsURL;

  constructor(private http: HttpClient) { }

}
