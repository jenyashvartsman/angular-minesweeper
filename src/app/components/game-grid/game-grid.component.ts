import { Component } from '@angular/core';
import { GameState } from '../../state/game.state';
import { Observable } from 'rxjs';
import { GameDto } from '../../dto/game.dto';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-game-grid',
  imports: [AsyncPipe],
  templateUrl: './game-grid.component.html',
  styleUrl: './game-grid.component.css',
})
export class GameGridComponent {
  game$: Observable<GameDto>;

  constructor(private gameState: GameState) {
    this.game$ = this.gameState.game$;
  }

  cellClick(row: number, col: number): void {
    this.gameState.revealCell(row, col);
  }
}
