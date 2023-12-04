export class MatchWithPlayers {
  matchId?: number;
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

export class Players {
  playerId?: number;
  fullName?: string;
  active?: boolean;
}

export class ResponseDto<T> {
  responseData?: T;
  messageToClient?: string;
}
