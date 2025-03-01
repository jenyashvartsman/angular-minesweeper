import { CellDto } from './cell.dto';

export interface GameDto {
  status: 'idle' | 'inProgress' | 'won' | 'lost';
  rows: number;
  cols: number;
  cells: CellDto[][];
}
