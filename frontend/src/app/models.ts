

export class Player {
  playerId?: number;
  fullName?: string;
  active?: boolean;
}
export class Match {
  public id?: number;
  public environment?: string;
  public surface?: string;
  public date?: Date;
  public startTime?: Date;
  public endTime?: Date;
  public finished?: boolean;
  public notes?: string;
}
export class MatchWithPlayers {
  id?: number;
  environment?: string;
  surface?: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  finished?: boolean;
  notes?: string;
  playerId1?: number;
  playerId2?: number;
  fullNamePlayer1?: string;
  fullNamePlayer2?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

export class ResponseDto<T> {
  responseData?: T;
  messageToClient?: string;
}
export class Shot{
  shotsId?: number;
  playerId?: number;
  matchId?: number;
  shotClassification?: string;
  shotType?: string;
  shotDestination?: string;
  shotDirection?: string;
  playerPosition?: string;
}
