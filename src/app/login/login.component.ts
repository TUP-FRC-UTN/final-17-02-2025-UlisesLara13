import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm: FormGroup;
  users: User[] = [];
  loading = false;
  private apiSubscriptions: Subscription[] = [];
  private readonly userService = inject(UsersService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], 
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
  }

  login(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    const user = this.users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.username);
      localStorage.setItem('userName', user.name);
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/scores']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }

  loadUsers(): void {
    this.loading = true;
    const apiSubscription = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.loading = false;
      }
    });

    this.apiSubscriptions.push(apiSubscription);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
