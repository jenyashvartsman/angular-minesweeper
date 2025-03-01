import { CellDto } from './cell.dto';

export interface GameDto {
  rows: number;
  cols: number;
  flags: number;
  cells: CellDto[][];
}
