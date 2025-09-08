export type GameTeam = "Main" | "D2" | "U17" | "U14" | "flag";

export interface Game {
  id: string;
  date: string; // ISO string
  time: string;
  home_team: string;
  away_team: string;
  location: string;
  sport?: string;
  team: GameTeam;
}
