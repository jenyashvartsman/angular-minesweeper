import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CellDto } from '../dto/cell.dto';
import { GameDto } from '../dto/game.dto';

@Injectable({
  providedIn: 'root',
})
export class GameState {
  private readonly game: BehaviorSubject<GameDto> = new BehaviorSubject<GameDto>({
    status: 'idle',
    rows: 0,
    cols: 0,
    cells: [],
  });
  private readonly flagsLeft: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  game$!: Observable<GameDto>;
  flagsLeft$!: Observable<number>;

  constructor() {
    this.initGame();
    this.game$ = this.game.asObservable();
    this.flagsLeft$ = this.flagsLeft.asObservable();
  }

  initGame(): void {
    const flags = 10;
    const rows = 10;
    const cols = 10;

    const game = this.createGame(rows, cols);
    this.seedMines(game, flags);
    this.seedMinesProximity(game);

    this.game.next(game);
    this.flagsLeft.next(flags);
  }

  revealCell(row: number, col: number): void {
    const game = this.game.getValue();
    if (game.status === 'idle' || game.status === 'inProgress') {
      this.revealCellsProximity(game, row, col);

      // @ts-ignore
      if (game.status !== 'lost') {
        this.updateGameStatus(game);
      } else {
        this.revealMines(game);
      }

      this.game.next(game);
    }
  }

  flagCell(row: number, col: number): void {
    const game = this.game.getValue();

    if (game.status === 'idle' || game.status === 'inProgress') {
      const cell = game.cells[row][col];
      const currentFlagsLeft = this.flagsLeft.getValue();

      if (!cell.reveled) {
        if (cell.marked === null && currentFlagsLeft > 0) {
          cell.marked = 'flag';
          this.flagsLeft.next(currentFlagsLeft - 1);
        } else if (cell.marked === 'flag') {
          cell.marked = 'question';
          this.flagsLeft.next(currentFlagsLeft + 1);
        } else {
          cell.marked = null;
        }
      }

      this.updateGameStatus(game);

      this.game.next(game);
    }
  }

  private createGame(rows: number, cols: number): GameDto {
    return {
      status: 'idle',
      rows,
      cols,
      cells: Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          reveled: false,
          marked: null,
          isMine: false,
          isMineClicked: false,
          isMineHidden: true,
          minesProximity: 0,
        })),
      ),
    };
  }

  private seedMines(game: GameDto, minesCount: number): void {
    while (minesCount > 0) {
      let r = Math.floor(Math.random() * game.rows);
      let c = Math.floor(Math.random() * game.cols);
      if (!game.cells[r][c].isMine) {
        game.cells[r][c].isMine = true;
        minesCount--;
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

  private revealCellsProximity(game: GameDto, row: number, col: number): void {
    if (!game.cells[row] || !game.cells[row][col]) {
      return;
    } else {
      const cell = game.cells[row][col];

      if (cell.reveled) {
        return;
      } else {
        cell.reveled = true;

        if (cell.isMine) {
          game.status = 'lost';
          cell.isMineClicked = true;
          return;
        } else if (game.cells[row][col].minesProximity > 0) {
          return;
        } else {
          game.cells[row][col].reveled = true;
          this.revealCellsProximity(game, row - 1, col);
          this.revealCellsProximity(game, row + 1, col);
          this.revealCellsProximity(game, row, col - 1);
          this.revealCellsProximity(game, row, col + 1);
        }
      }
    }
  }

  private updateGameStatus(game: GameDto): void {
    for (let i = 0; i < game.cells.length; i++) {
      for (let j = 0; j < game.cells[i].length; j++) {
        const cell = game.cells[i][j];
        if (!cell.reveled && cell.marked !== 'flag') {
          game.status = 'inProgress';
          return;
        }
      }
    }

    game.status = 'won';
  }

  private revealMines(game: GameDto): void {
    for (let i = 0; i < game.cells.length; i++) {
      for (let j = 0; j < game.cells[i].length; j++) {
        const cell = game.cells[i][j];
        if (cell.isMine) {
          cell.reveled = true;
        }
      }
    }
  }
}
