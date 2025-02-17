import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WordsService } from '../services/words.service';
import { ScoreService } from '../services/score.service';
import { Word } from '../models/Word';
import { Score } from '../models/Score';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy {
restart() {
this.saveScore();
console.log(this.score);
window.location.reload();
}
  email: string = '';
  gameId: string = '';
  name: string = localStorage.getItem('userName') || '';
  loading = false;
  score: Score | null = null;
  tries = 6;
  word: Word | null = null;
  displayedWord: string[] = [];
  incorrectLetters: string[] = [];
  correctLetters: string[] = [];
  alphabet = 'abcdefghijklmnñopqrstuvwxyz'.split('');
  private apiSubscriptions: Subscription[] = [];
  private readonly wordService = inject(WordsService);
  private readonly scoreService = inject(ScoreService);

  constructor(private router: Router) {}
  ngOnDestroy(): void {
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('userEmail') || '';
    this.generateGameId();
    this.loadRandomWord();
  }

  logOut(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    alert('Sesión cerrada');
    window.location.href = '/login';
  }

  goScores(): void {
    this.router.navigate(['/scores']);
  }

  loadRandomWord(): void {
    this.loading = true;
    const apiSubscription = this.wordService.getRandomWord().subscribe({
      next: (word) => {
        this.word = word;
        this.displayedWord = Array(word.word.length).fill('_');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading the word', error);
        this.loading = false;
      }
    });
    this.apiSubscriptions.push(apiSubscription);
  }

  checkLetter(letter: string): void {
    if (!this.word || this.correctLetters.includes(letter) || this.incorrectLetters.includes(letter)) {
      return;
    }
    
    if (this.word.word.includes(letter)) {
      this.word.word.split('').forEach((char, index) => {
        if (char === letter) {
          this.displayedWord[index] = letter;
        }
      });
      this.correctLetters.push(letter);
    } else {
      this.tries--;
      this.incorrectLetters.push(letter);
    }

    if (this.tries === 0 || !this.displayedWord.includes('_')) {
      this.saveScore();
    }
  }

  isLetterUsed(letter: string): boolean {
    return this.correctLetters.includes(letter) || this.incorrectLetters.includes(letter);
  }
  generateGameId(): void {
    const initials = this.getInitials(this.name);
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    this.gameId = `P${randomNumber}${initials}`;
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    return parts.map(part => part[0].toUpperCase()).join('');
  }

  saveScore(): void {
    const points = this.calculateScore();
    const newScore: Score = {
      id: '',
      playerName: this.name,
      idGame: this.gameId,
      score: points,
      date: new Date().toISOString().split('T')[0],
      word: this.word?.word || '',
      attemptsLeft: this.tries
    };
  
    console.log('Enviando puntuación:', newScore);
  
    this.scoreService.saveScore(newScore).subscribe({
      next: () => console.log('Puntuación guardada con éxito'),
      error: (error) => console.error('Error al guardar la puntuación:', error)
    });
  }
  

  calculateScore(): number {
    switch (this.tries) {
      case 6: return 100;
      case 5: return 80;
      case 4: return 60;
      case 3: return 40;
      case 2: return 20;
      case 1: return 10;
      default: return 0;
    }
  }
}
