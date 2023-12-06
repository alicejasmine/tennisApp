
import {MatchWithPlayers, Players} from "../models";
import {Injectable} from "@angular/core";
import { Player } from "./models";



@Injectable({
  providedIn: 'root'
})

export class DataService {

  public matchesWithPlayers: MatchWithPlayers[] = [];
  public currentMatch: MatchWithPlayers = {};
  public players: Player[] = [];
  public currentPlayer: Player = {};

}
