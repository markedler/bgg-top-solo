import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import { catchError, map, mergeMap, retryWhen } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class BggDataService {

  private rootUrl = 'https://www.boardgamegeek.com/xmlapi2';

  constructor(private http: HttpClient) { }

  getGameData(game: string): Promise<any> {

    return this.searchGame(game)
      .pipe(map(searchResults => {
        let searchResultz = searchResults.items;
        for (const searchResult of searchResults.items.item) {
          if (searchResult.name[0].$.value.toUpperCase() === game.toUpperCase()) {
            console.log(searchResult.$.id);
            return searchResult.$.id;
          }
        }
        console.log(searchResults.items.item[0].$.id);
        return searchResults.items.item[0].$.id;
      }))
      .pipe(mergeMap(id => this.getBggGameData(id)))
      .pipe(map(value => value.items.item[0]))
      .toPromise();
  }

  private searchGame(game: string): Observable<any> {
    const param = game.replace(' ','+').replace(':', '');
    const url = this.rootUrl + '/search?type=boardgame&query=' + param;
    return this.apiCall(url);
  }

  private getBggGameData(id: number): Observable<any> {

    const url = this.rootUrl + '/thing?id=' + id;
    return this.apiCall(url);
  }

  private apiCall(url): Observable<any> {
    let json = {};
    return this.http.get(url, {observe: 'body', responseType: 'text'}).pipe(map(resp => {

      xml2js.parseString(resp, (error: any, result: {}) => {
        json = result;
      });
      return json;
    }));
  }
}
