import { Component, OnInit } from '@angular/core';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { BggDataService } from '../bgg-data.service';
import { Game } from '../models/game.model';
import * as data from '../data/top200.json'; 
import { ApiService } from '../api.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  games: Game[];

  orderBy = 'rank';
  isOrderDesc = false;

  faSortUp = faSortUp;
  faSortDown = faSortDown;

  constructor(private bggDataService: BggDataService, private apiService: ApiService) { }

  ngOnInit(): void {

    this.apiService.fetchGames().subscribe(games => {
      this.games = games;
      console.log(this.games);
    });
  }

  sort(orderBy: string): void {

    if (orderBy === this.orderBy) {
      this.isOrderDesc = !this.isOrderDesc;
    }
    else {
      this.isOrderDesc = false;
    }

    this.games.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (typeof(aValue) === 'string' && typeof(bValue) === 'string') {
        const aString = aValue.toUpperCase();
        const bString = bValue.toUpperCase();

        if (aString < bString) {
          return this.isOrderDesc ? 1 : -1;
        }
        if (aString > bString) {
          return this.isOrderDesc ? -1 : 1;
        }
        return 0;
      }
      else {
        if (this.isOrderDesc) {
          return bValue - aValue;
        }
        else {
          return aValue - bValue;
        }
      }
    });

    this.orderBy = orderBy;
  }

  getRatingStyle(rating: number): string {
    const num = Math.trunc(rating);

    return 'rating' + num;
  }

  onSaveData(): void {
    this.apiService.deleteGames().toPromise().then(() => this.apiService.storeGames(this.games));
  }

}
