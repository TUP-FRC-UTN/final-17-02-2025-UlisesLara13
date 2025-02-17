import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { Score } from '../models/Score';
import { Subscription } from 'rxjs';
import { ScoreService } from '../services/score.service';
import { CommonModule } from '@angular/common';
import { FechaPipe } from '../pipes/fecha.pipe';

@Component({
  selector: 'app-scores',
  imports: [FormsModule, CommonModule, FechaPipe],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }
  loading = false;
  scores: Score[] = [];
  private apiSubscriptions: Subscription[] = [];
  private readonly scoreService = inject(ScoreService);

  ngOnDestroy(): void {
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
  }
  ngOnInit(): void {
    this.loadScores();
    this.email = localStorage.getItem('userEmail') || '';
  }

  email: string = '';

  logOut(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    alert('Sesión cerrada');
    window.location.href = '/login';
  }

  goJugar(): void {
    this.router.navigate(['/game']);
  }

  loadScores(): void {
    this.loading = true;
    const apiSubscription = this.scoreService.getScores().subscribe({
      next: (scores) => {
        this.scores = scores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.loading = false;
      }
    });

    this.apiSubscriptions.push(apiSubscription);
  }

}
