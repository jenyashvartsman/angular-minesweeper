import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CellDto } from '../dto/cell.dto';
import { GameDto } from '../dto/game.dto';

@Injectable({
  providedIn: 'root',
})
export class GameState {
  private game!: BehaviorSubject<GameDto>;

  game$!: Observable<GameDto>;

  constructor() {
    this.initGame();
    this.game$ = this.game.asObservable();
  }

  initGame(): void {
    const game = this.createGame(10, 10, 10);
    this.seedMines(game);
    this.seedMinesProximity(game);
    this.game = new BehaviorSubject<GameDto>(game);
  }

  revealCell(row: number, col: number): void {
    const game = this.game.getValue();
    game.cells[row][col].reveled = true;
    this.game.next(game);
  }

  private createGame(rows: number, cols: number, flags: number): GameDto {
    return {
      flags,
      rows,
      cols,
      cells: Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          reveled: false,
          marked: null,
          isMine: false,
          minesProximity: 0,
        })),
      ),
    };
  }

  private seedMines(game: GameDto): void {
    let count = game.flags;
    while (count > 0) {
      let r = Math.floor(Math.random() * game.rows);
      let c = Math.floor(Math.random() * game.cols);
      if (!game.cells[r][c].isMine) {
        game.cells[r][c].isMine = true;
        count--;
      }
    }
  }

  private seedMinesProximity(game: GameDto): void {
    for (let i = 0; i < game.rows; i++) {
      for (let j = 0; j < game.cols; j++) {
        const currentCell = game.cells[i][j];
        if (!currentCell.isMine) {
          this.hasMine(game, currentCell, i - 1, j - 1); // top left
          this.hasMine(game, currentCell, i - 1, j); // top center
          this.hasMine(game, currentCell, i - 1, j + 1); // top right
          this.hasMine(game, currentCell, i, j - 1); // middle left
          this.hasMine(game, currentCell, i, j + 1); // middle right
          this.hasMine(game, currentCell, i + 1, j - 1); // bottom left
          this.hasMine(game, currentCell, i + 1, j); // bottom center
          this.hasMine(game, currentCell, i + 1, j + 1); // bottom right
        }
      }
    }
  }

  private hasMine(game: GameDto, currentCell: CellDto, proximityRow: number, proximityCol: number): void {
    if (game.cells[proximityRow] && game.cells[proximityRow][proximityCol]?.isMine) {
      currentCell.minesProximity++;
    }
  }
}
