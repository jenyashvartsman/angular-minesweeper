import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from '../../state/game.state';
import { AsyncPipe } from '@angular/common';
import { GameDto } from '../../dto/game.dto';

@Component({
  selector: 'app-game-info',
  imports: [AsyncPipe],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css',
})
export class GameInfoComponent {
  game$: Observable<GameDto>;
  flagsLeft$: Observable<number>;

  constructor(private gameState: GameState) {
    this.flagsLeft$ = this.gameState.flagsLeft$;
    this.game$ = this.gameState.game$;
  }
}
