import {MatchWithPlayers} from "../models";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public matchesWithPlayers: MatchWithPlayers[] =[];
  public currentMatch: MatchWithPlayers = {};
}
