import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  getUserRole(): string {
    return localStorage.getItem('userRole') || ''; 
  }

  login(token: string, role: string) {
    localStorage.setItem('userRole', role);
  }

  logout() {
    localStorage.removeItem('userRole');
  }
}
