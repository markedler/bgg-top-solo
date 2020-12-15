import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Game } from './models/game.model';

@Injectable({providedIn: 'root'})
export class ApiService {

  constructor(private http: HttpClient) {}

  storeGames(games: Game[]): void {

    const url = 'https://bgg-games-7d3ad-default-rtdb.firebaseio.com/games.json';

    for (const game of games) {
      this.http.post<{ name: string }>(url, game).subscribe(
        responseData => console.log(responseData),
        error => console.log(error));
    }
  }

  fetchGames(): Observable<Game[]> {
    const url = 'https://bgg-games-7d3ad-default-rtdb.firebaseio.com/games.json';

    return this.http.get<{[key: string]: Game}>(url).pipe(
      map(data => {
        const gamesArray: Game[] = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            gamesArray.push({...data[key], id: key});
          }
        }
        return gamesArray;
      }));

    // .subscribe(res => {
    //   console.log(res);
    //   return res[0];
    // },
    // error => {
    //   console.log(error);
    //   const games: Game[] = [];
    //   return games;
    // });
  }

  deleteGames(): Observable<any> {
    return this.http.delete(
      'https://ng-complete-guide-f922c-default-rtdb.firebaseio.com/games.json'
    );
  }
}
