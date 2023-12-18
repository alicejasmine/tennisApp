import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {DataService} from 'src/app/data.service';
import {Shot} from 'src/app/models';
import {ToastController} from "@ionic/angular";


@Injectable({
  providedIn: 'root',
})
export class ShotService {
  //shot classification
  public winnerCountPlayer1 = 0;
  public forcedErrorCountPlayer1 = 0;
  public unforcedErrorCountPlayer1 = 0;

  public winnerCountPlayer2 = 0;
  public forcedErrorCountPlayer2 = 0;
  public unforcedErrorCountPlayer2 = 0;

  //shot type (winners)
  public forehandGroundstrokeWinnerCountPlayer1 = 0;
  public forehandGroundstrokeWinnerCountPlayer2 = 0;
  public forehandReturnWinnerCountPlayer1 = 0;
  public forehandReturnWinnerCountPlayer2 = 0;

  public serveDeuceWinnerCountPlayer1 = 0;
  public serveDeuceWinnerCountPlayer2 = 0;

  public serveAddWinnerCountPlayer1 = 0;
  public serveAddWinnerCountPlayer2 = 0;

  public backhandGroundstrokeWinnerCountPlayer1 = 0;
  public backhandGroundstrokeWinnerCountPlayer2 = 0;

  public backhandReturnWinnerCountPlayer1 = 0;
  public backhandReturnWinnerCountPlayer2 = 0;

  public forehandVolleyWinnerCountPlayer1 = 0;
  public forehandVolleyWinnerCountPlayer2 = 0;

  public backhandVolleyWinnerCountPlayer1 = 0;
  public backhandVolleyWinnerCountPlayer2 = 0;

  public overheadWinnerCountPlayer1 = 0;
  public overheadWinnerCountPlayer2 = 0;

  public otherWinnerCountPlayer1 = 0;
  public otherWinnerCountPlayer2 = 0;

  //Shot type(FE)

  public forehandGroundstrokeFECountPlayer1 = 0;
  public forehandGroundstrokeFECountPlayer2 = 0;

  public forehandReturnFECountPlayer1 = 0;
  public forehandReturnFECountPlayer2 = 0;

  public serveDeuceFECountPlayer1 = 0;
  public serveDeuceFECountPlayer2 = 0;

  public serveAddFECountPlayer1 = 0;
  public serveAddFECountPlayer2 = 0;

  public backhandGroundstrokeFECountPlayer1 = 0;
  public backhandGroundstrokeFECountPlayer2 = 0;

  public backhandReturnFECountPlayer1 = 0;
  public backhandReturnFECountPlayer2 = 0;

  public forehandVolleyFECountPlayer1 = 0;
  public forehandVolleyFECountPlayer2 = 0;

  public backhandVolleyFECountPlayer1 = 0;
  public backhandVolleyFECountPlayer2 = 0;

  public overheadFECountPlayer1 = 0;
  public overheadFECountPlayer2 = 0;

  public otherFECountPlayer1 = 0;
  public otherFECountPlayer2 = 0;

  //Shot type(UE)

  public forehandGroundstrokeUECountPlayer1 = 0;
  public forehandGroundstrokeUECountPlayer2 = 0;

  public forehandReturnUECountPlayer1 = 0;
  public forehandReturnUECountPlayer2 = 0;

  public serveDeuceUECountPlayer1 = 0;
  public serveDeuceUECountPlayer2 = 0;

  public serveAddUECountPlayer1 = 0;
  public serveAddUECountPlayer2 = 0;

  public backhandGroundstrokeUECountPlayer1 = 0;
  public backhandGroundstrokeUECountPlayer2 = 0;

  public backhandReturnUECountPlayer1 = 0;
  public backhandReturnUECountPlayer2 = 0;

  public forehandVolleyUECountPlayer1 = 0;
  public forehandVolleyUECountPlayer2 = 0;

  public backhandVolleyUECountPlayer1 = 0;
  public backhandVolleyUECountPlayer2 = 0;

  public overheadUECountPlayer1 = 0;
  public overheadUECountPlayer2 = 0;

  public otherUECountPlayer1 = 0;
  public otherUECountPlayer2 = 0;

  constructor(private httpClient: HttpClient, public dataService: DataService, public toastController: ToastController,) {
  }

  async registerShot() {

    const playerId = this.dataService.currentShot.playerId;
    const matchId = this.dataService.currentShot.matchId;

    const shotData = {
      ShotClassification: this.dataService.currentShot.shotClassification,
      ShotType: this.dataService.currentShot.shotType,
      ShotDestination: this.dataService.currentShot.shotDestination,
      ShotDirection: this.dataService.currentShot.shotDirection,
      PlayerPosition: this.dataService.currentShot.playerPosition,
    };
    try {

      const call = this.httpClient.post<Shot>(`/api/shots/${playerId}/${matchId}/shots`, shotData);
      const result = await firstValueFrom<Shot>(call);
      this.dataService.shots.push(result);
      const toast = await this.toastController.create({
        color: 'success',
        duration: 2000,
        message: "Success"
      })
      toast.present();
    } catch (error: any) {
      console.log(error);
      let errorMessage = 'Error';

      if (error instanceof HttpErrorResponse) {
        // The backend returned an unsuccessful response code.
        errorMessage = error.error?.message || 'Server error';
      } else if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred.
        errorMessage = error.error.message;
      }

      const toast = await this.toastController.create({
        color: 'danger',
        duration: 200000,
        message: errorMessage
      });

      toast.present();
    }
  }


  async countShotsForPlayerByMatch(playerId: number, matchId: number) {
    try {

      const call = `/api/shots/${playerId}/${matchId}/shots`;
      const shots = await firstValueFrom(this.httpClient.get<Shot[]>(call));

      //all shots count based on classification
      shots.forEach((shot) => {
        this.updateShotClassificationCount(shot.playerId, shot.shotClassification);
      });

      //filter only winners
      const winners = shots.filter(shot => shot.shotClassification === 'Winner');

      //filter only forced errors
      const forcedErrors = shots.filter(shot => shot.shotClassification === 'Forced Error');

      //filter only unforced errors
      const unforcedErrors = shots.filter(shot => shot.shotClassification === 'Unforced Error');

      //count shot type in winners
      winners.forEach((shot) => {
        this.updateShotTypeCount(shot.playerId, shot.shotType, 'Winner');
      });

      //count shot type in forced errors
      forcedErrors.forEach((shot) => {
        this.updateShotTypeCount(shot.playerId, shot.shotType, 'Forced Error');
      });

      //count shot type in unforced errors
      unforcedErrors.forEach((shot) => {
        this.updateShotTypeCount(shot.playerId, shot.shotType, 'Unforced Error');
      });
    } catch (error: any) {
      console.log(error);
      let errorMessage = 'Error';
    }
  }


  private updateShotClassificationCount(playerId: number | undefined, shotClassification: string | undefined) {
    switch (shotClassification) {
      case 'Winner':
        if (playerId === this.dataService.currentMatch.playerId1) {
          this.winnerCountPlayer1++;
        } else if (playerId === this.dataService.currentMatch.playerId2) {
          this.winnerCountPlayer2++;
        }
        break;
      case 'Forced Error':
        if (playerId === this.dataService.currentMatch.playerId1) {
          this.forcedErrorCountPlayer1++;
        } else if (playerId === this.dataService.currentMatch.playerId2) {
          this.forcedErrorCountPlayer2++;
        }
        break;
      case 'Unforced Error':
        if (playerId === this.dataService.currentMatch.playerId1) {
          this.unforcedErrorCountPlayer1++;
        } else if (playerId === this.dataService.currentMatch.playerId2) {
          this.unforcedErrorCountPlayer2++;
        }
        break;
    }
  }

  private updateShotTypeCount(playerId: number | undefined, shotType: string | undefined, countClassific: string | undefined) {
    switch (shotType) {
      case 'Forehand Groundstroke':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandGroundstrokeWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandGroundstrokeWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandGroundstrokeFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandGroundstrokeFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandGroundstrokeUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandGroundstrokeUECountPlayer2++;
          }
        }
        break;

      case 'Forehand Return':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandReturnWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandReturnWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandReturnFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandReturnFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandReturnUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandReturnUECountPlayer2++;
          }
        }
        break;
      case 'Serve Deuce':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.serveDeuceWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.serveDeuceWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.serveDeuceFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.serveDeuceFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.serveDeuceUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.serveDeuceUECountPlayer2++;
          }
        }
        break;
      case 'Serve Add':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.serveAddWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.serveAddWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.serveAddFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.serveAddFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.serveAddUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.serveAddUECountPlayer2++;
          }
        }
        break;
      case 'Backhand Groundstroke':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandGroundstrokeWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandGroundstrokeWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandGroundstrokeFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandGroundstrokeFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandGroundstrokeUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandGroundstrokeUECountPlayer2++;
          }
        }
        break;
      case 'Backhand Return':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandReturnWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandReturnWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandReturnFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandReturnFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandReturnUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandReturnUECountPlayer2++;
          }
        }
        break;
      case 'Forehand Volley':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandVolleyWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandVolleyWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandVolleyFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandVolleyFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.forehandVolleyUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.forehandVolleyUECountPlayer2++;
          }
        }
        break;
      case 'Backhand Volley':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandVolleyWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandVolleyWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandVolleyFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandVolleyFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.backhandVolleyUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.backhandVolleyUECountPlayer2++;
          }
        }
        break;
      case 'Overhead':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.overheadWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.overheadWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.overheadFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.overheadFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.overheadUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.overheadUECountPlayer2++;
          }
        }
        break;
      case 'Other':
        if (countClassific === 'Winner') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.otherWinnerCountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.otherWinnerCountPlayer2++;
          }
        } else if (countClassific === 'Forced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.otherFECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.otherFECountPlayer2++;
          }
        } else if (countClassific === 'Unforced Error') {
          if (playerId === this.dataService.currentMatch.playerId1) {
            this.otherUECountPlayer1++;
          } else if (playerId === this.dataService.currentMatch.playerId2) {
            this.otherUECountPlayer2++;
          }
        }
        break;
    }
  }

}
