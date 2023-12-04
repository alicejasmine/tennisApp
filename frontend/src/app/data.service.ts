import {MatchWithPlayers, Players} from "../models";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public matchesWithPlayers: MatchWithPlayers[] =[];
  public currentMatch: MatchWithPlayers = {};
  public players: Players[] = [];
}
