import { Component } from '@angular/core';
import { GameGridComponent } from './components/game-grid/game-grid.component';
import { GameInfoComponent } from './components/game-info/game-info.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [GameGridComponent, GameInfoComponent],
})
export class AppComponent {}
