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

