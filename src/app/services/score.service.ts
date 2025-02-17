import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Score } from '../models/Score';
import { environment } from '../models/Enviroment';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http: HttpClient) { }
  
    getScores(): Observable<Score[]> {
      return this.http.get<Score[]>(`${environment.apiScores}`);
    }

    saveScore(score: Score): Observable<Score> {
      return this.http.post<Score>(`${environment.apiScores}`, score);
    }

    getScoresByName(name: string): Observable<Score[]> {
      return this.http.get<Score[]>(`${environment.apiScores}?playerName=${name}`).pipe(
      catchError(() => of([]))
      );
    }
}
