import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Word } from '../models/Word';
import { environment } from '../models/Enviroment';

@Injectable({
  providedIn: 'root'
})
export class WordsService {

    constructor(private http: HttpClient) { }
  
    getWords(): Observable<Word[]> {
      return this.http.get<Word[]>(`${environment.apiWords}`);
    }

    getRandomWord(): Observable<Word> {
      return this.getWords().pipe(
      map(words => words[Math.floor(Math.random() * words.length)])
      );
    }
}
