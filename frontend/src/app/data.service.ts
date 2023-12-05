import {Injectable} from "@angular/core";
import {Match, Player} from "./models";
@Injectable({
  providedIn: 'root'
})

export class DataService {

  public players: Player[] = [];
  public currentPlayer: Player = {};
  public matches: Match[] = [];
  public currentMatch: Match = {};
}
