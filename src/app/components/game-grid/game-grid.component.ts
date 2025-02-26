import { Component } from '@angular/core';

@Component({
  selector: 'app-game-grid',
  imports: [],
  templateUrl: './game-grid.component.html',
  styleUrl: './game-grid.component.css',
})
export class GameGridComponent {
  readonly rows = 10;
  readonly cols = 10;
  readonly grid: string[][] = Array.from(Array(this.rows), () => Array(this.cols));
}
