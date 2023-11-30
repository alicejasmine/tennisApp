import { Injectable } from "@angular/core";
import { Player } from "./models";
@Injectable({
  providedIn: 'root'
})

export class DataService {

  public players: Player[] = [];
  public currentPlayer: Player = {};
}
