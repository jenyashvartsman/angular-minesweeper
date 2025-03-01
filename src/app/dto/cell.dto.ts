export interface CellDto {
  reveled: boolean;
  marked: 'flag' | 'question' | null;
  isMine: boolean;
  minesProximity: number;
}
