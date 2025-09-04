import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { IUser } from '../Model/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = "http://localhost:5122/api"

  constructor(private http: HttpClient) { }

  register(data: IUser): Observable<any> {
    return this.http.post(`${this.baseURL}/User/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/User/login`, data);
  }



  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenData(): { role: string | null, name: string | null, email: string | null } | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);

      const role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;

      const name =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;

      const email =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;

      return { role, name, email };
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }


  logout() {
    localStorage.removeItem("token");
  }
}
