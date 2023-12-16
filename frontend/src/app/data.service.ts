import {Injectable} from "@angular/core";
import {MatchWithPlayers, Match, Player, Shot} from "./models";


@Injectable({
  providedIn: 'root'
})

export class DataService {

  public matchesWithPlayers: MatchWithPlayers[] = [];
  public currentMatch: MatchWithPlayers = {};
  public players: Player[] = [];
  public currentPlayer: Player = {};
  public matches: Match[] = [];
  public currentShot: Shot = {};
  public shots: Shot[] = [];

}
