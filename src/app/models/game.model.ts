export interface Game {
  id: string;
  name: string;
  rank: number;
  rankChange: number;
  topVotes: number;
  yearsOnList: number;
  highestRank: number;
  bggRank: number;
  bggRating: number;
  yearPublished: number;
  weight: number;
  bggLink: string;
  minPlayers: number;
  maxPlayers: number;
  minPlayingTime: number;
  maxPlayingTime: number;
  categories: string;
  mechanisms: string;
  imagePath: string;
}